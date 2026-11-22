import { checkJobReaderRateLimit } from "@/lib/job-reader-rate-limit";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { Agent, request as undiciRequest } from "undici";
import { load } from "cheerio";
import dns from "node:dns/promises";
import { isIP } from "node:net";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
function isPublicIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);

  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    return false;
  }

  const [a, b, c] = parts;

  if (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 192 && b === 0 && c === 2) ||
    (a === 192 && b === 88 && c === 99) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113)
  ) {
    return false;
  }

  return true;
}

async function hasOnlyPublicAddresses(hostname: string): Promise<boolean> {
  if (isIP(hostname) !== 0) {
    return false;
  }

  try {
    const addresses = await dns.lookup(hostname, {
      all: true,
      verbatim: true,
    });

    if (addresses.length === 0) return false;

    return addresses.every(
      (entry) =>
        entry.family === 4 && isPublicIPv4(entry.address)
    );
  } catch {
    return false;
  }
}

async function createSafeDispatcher(hostname: string): Promise<Agent> {
  const addresses = await dns.lookup(hostname, {
    all: true,
    family: 4,
  });

  if (
    addresses.length === 0 ||
    !addresses.every((entry) => isPublicIPv4(entry.address))
  ) {
    throw new Error("Unsafe destination address.");
  }

  const approvedIP = addresses[0].address;
if (process.env.NODE_ENV === "development") {
  console.log("[Job Reader] Approved public IP:", approvedIP);
}
  return new Agent({
    connect: {
    lookup: (_hostname, options, callback) => {
  if (!isPublicIPv4(approvedIP)) {
   callback(new Error("Unsafe destination IP."), []);
    return;
  }

  if (options.all) {
    callback(null, [{ address: approvedIP, family: 4 }]);
  } else {
    callback(null, approvedIP, 4);
  }
},
      servername: hostname,
      rejectUnauthorized: true,
    },
    headersTimeout: 10000,
    bodyTimeout: 10000,
  });
}

async function fetchJobHtml(url: URL): Promise<string> {
  const dispatcher = await createSafeDispatcher(url.hostname);

  try {
    const response = await undiciRequest(url.toString(), {
  dispatcher,
  method: "GET",
  headers: {
        accept: "text/html",
        "user-agent": "TalentSphereJobReader/1.0",
      },
      headersTimeout: 10000,
      bodyTimeout: 10000,
      signal: AbortSignal.timeout(15000),
    });
    if (response.statusCode >= 300 && response.statusCode < 400) {
      throw new Error(
        "This job website redirects to another page. Please paste the job description manually."
      );
    }

    if (response.statusCode !== 200) {
      throw new Error(
        "The job website could not be read. Please paste the job description manually."
      );
    }

    const contentType = String(
      response.headers["content-type"] || ""
    ).toLowerCase();

    if (!contentType.includes("text/html")) {
      throw new Error(
        "This link does not return an HTML job advertisement."
      );
    }

    const chunks: Buffer[] = [];
    let totalBytes = 0;
    const maxBytes = 1024 * 1024;

    for await (const chunk of response.body) {
      const buffer = Buffer.from(chunk);
      totalBytes += buffer.length;

      if (totalBytes > maxBytes) {
        throw new Error("The job advertisement page is too large.");
      }

      chunks.push(buffer);
    }

    const htmlBuffer = Buffer.concat(chunks);

const charsetMatch = contentType.match(
  /charset\s*=\s*["']?([^;"'\s]+)/i
);

const charset = charsetMatch?.[1]?.toLowerCase() || "utf-8";

const decodedHtml = new TextDecoder(charset).decode(htmlBuffer);

// Repair common UTF-8 text incorrectly interpreted as Latin-1.
return decodedHtml.replace(
 /\u00E2[\u0080-\u00BF]{2}/g,
  (match) => {
    try {
      const bytes = Uint8Array.from(
        [...match].map((char) => char.charCodeAt(0))
      );

      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      return match;
    }
  }
)
  } finally {
    await dispatcher.close();
  }
}

function extractJobDescription(html: string): string {
  const $ = load(html);

  // Remove content unrelated to the job advertisement.
  $(
    "script, style, noscript, nav, footer, header, " +
    "aside, iframe, form, button, svg"
  ).remove();

  // Prefer structured job description containers.
  const selectors = [
    '[itemprop="description"]',
    '[data-testid="job-description"]',
    ".job-description",
    "#job-description",
    ".jobDescription",
    ".description",
    "article",
    "main",
  ];

  for (const selector of selectors) {
    const element = $(selector).first();

    if (element.length) {
      const text = element.text().replace(/\s+/g, " ").trim();

      if (text.length >= 100) {
        return text.slice(0, 15000);
      }
    }
  }

  // Fallback: extract readable text from the page body.
  return $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 15000);
}
function detectJobRoles(jobDescription: string): string[] {
  const roles: string[] = [];

  const pattern =
    /\b\d{1,2}[.)]\s+(.{5,100}?)\s+[–—-]\s+\d+\s+Openings\b/gi;

  for (const match of jobDescription.matchAll(pattern)) {
    const role = match[1].trim();

    if (
      role.length <= 80 &&
      !roles.some(
        (existing) => existing.toLowerCase() === role.toLowerCase()
      )
    ) {
      roles.push(role);
    }
  }

  return roles.length > 1 ? roles : [];
}
 function extractRoleDescription(
  jobDescription: string,
  role: string
): string {
  const roles = detectJobRoles(jobDescription);

  const selectedIndex = roles.indexOf(role);

  if (selectedIndex === -1) {
    return "";
  }

  const currentMarker = `${selectedIndex + 1}. ${role}`;

  const start = jobDescription.indexOf(currentMarker);

  if (start === -1) {
    return "";
  }

 if (selectedIndex === roles.length - 1) {
  const remainingText = jobDescription.slice(start);

  const endMarkers = [
    "APPLICATION DEADLINE",
    "GENERAL INFORMATION",
    "Never miss an opportunity",
  ];

  let end = remainingText.length;

  for (const marker of endMarkers) {
    const markerIndex = remainingText
      .toLowerCase()
      .indexOf(marker.toLowerCase());

    if (markerIndex !== -1 && markerIndex < end) {
      end = markerIndex;
    }
  }

  return remainingText.slice(0, end).trim();
}

  const nextMarker = `${selectedIndex + 2}. ${
    roles[selectedIndex + 1]
  }`;

  const end = jobDescription.indexOf(nextMarker, start);

  if (end === -1) {
    return "";
  }

  return jobDescription.slice(start, end).trim();
}
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to read job descriptions.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const link = body?.url;

    if (typeof link !== "string" || !link.trim()) {
      return NextResponse.json(
        { success: false, message: "Job application link is required." },
        { status: 400 }
      );
    }

    if (link.length > 2048) {
      return NextResponse.json(
        { success: false, message: "URL is too long." },
        { status: 400 }
      );
    }

    let url: URL;

    try {
      url = new URL(link);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid job application URL." },
        { status: 400 }
      );
    }

    if (!["http:", "https:"].includes(url.protocol)) {
      return NextResponse.json(
        { success: false, message: "Only HTTP and HTTPS links are allowed." },
        { status: 400 }
      );
    }

    if (url.username || url.password) {
      return NextResponse.json(
        { success: false, message: "URLs containing credentials are not allowed." },
        { status: 400 }
      );
    }
if (url.port) {
  return NextResponse.json(
    {
      success: false,
      message: "Custom URL ports are not allowed.",
    },
    { status: 400 }
  );
}
    const hostname = url.hostname.toLowerCase();

    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".test") ||
      hostname.endsWith(".invalid") ||
      hostname.endsWith(".example") ||
      hostname === "metadata.google.internal" ||
      hostname === "169.254.169.254" ||
      hostname.includes(":") ||
      /^[0-9.]+$/.test(hostname)
    ) {
      return NextResponse.json(
        { success: false, message: "This URL is not allowed." },
        { status: 400 }
      );
    }
const authorization = request.headers.get("authorization");
const accessToken = authorization?.slice(7).trim() ?? "";

const allowed = await checkJobReaderRateLimit(accessToken);

if (!allowed) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Job Reader limit reached. You can read up to 20 job links per hour. Please try again later.",
    },
    { status: 429 }
  );
}
   const publicAddress = await hasOnlyPublicAddresses(hostname);

if (!publicAddress) {
  return NextResponse.json(
    {
      success: false,
      message: "This job URL does not resolve to an allowed public address.",
    },
    { status: 400 }
  );
}


const html = await fetchJobHtml(url);

const jobDescription = extractJobDescription(html);

if (jobDescription.length < 100) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Could not find enough job description text. Please paste it manually.",
    },
    { status: 422 }
  );
}

const roles = detectJobRoles(jobDescription);

const roleDescriptions = roles.map((role) => ({
  role,
  description: extractRoleDescription(jobDescription, role),
}));

return NextResponse.json({
  success: true,
  jobDescription,
  roles,
  roleDescriptions,
});

  } catch (error) {
    if (
  error instanceof Error &&
  error.message ===
    "This job website redirects to another page. Please paste the job description manually."
) {
  return NextResponse.json(
    {
      success: false,
      message: error.message,
    },
    { status: 400 }
  );
}
  if (process.env.NODE_ENV === "development") {
    console.error("[Job Reader Error]", error);
  }

  return NextResponse.json(
    {
      success: false,
      message: "Invalid request.",
    },
    { status: 400 }
  );
}
}