import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
    lineHeight: 1.5,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  contact: {
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  heading: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#9ca3af",
    paddingBottom: 4,
  },
  paragraph: {
    marginBottom: 7,
  },
  item: {
    marginBottom: 9,
  },
    letterSender: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  letterSenderText: {
    fontSize: 10,
    textAlign: "left",
    width: 150,
    marginBottom: 3,
  },
  letterDate: {
    alignItems: "flex-end",
    marginBottom: 35,
  },
  letterRecipient: {
    marginBottom: 30,
  },
  letterSubject: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "underline",
    marginTop: 22,
    marginBottom: 26,
  },
  letterBody: {
    fontSize: 10,
    lineHeight: 2,
    textAlign: "justify",
    marginBottom: 12,
  },
});

type PDFProps = {
  type: "cv" | "letter" | "both";
  fullName: string;
  email: string;
  phone: string;
  location: string;
   linkedin: string | null;
  portfolio: string | null;
  jobTitle: string;
  professionalSummary: string;
  experiences: {
    jobTitle: string;
    company: string;
    bullets: string[];
  }[];
    skills: string[];
  education: {
    qualification: string;
    institution: string;
    field_of_study: string | null;
    start_year: string | number | null;
    graduation_year: string | number | null;
  }[];
    certifications: {
    name: string;
    organization: string | null;
    date: string | null;
  }[];
    projects: {
    name: string;
    description: string | null;
    link: string | null;
  }[];
    languages: {
    language: string;
    level: string | null;
  }[];
  referees: {
  full_name: string;
  position: string | null;
  organization: string | null;
  email: string | null;
  phone: string | null;
}[];
  coverLetter: string;
};

export default function TalentSpherePDF({
  type,
  fullName,
  email,
  phone,
  location,
  linkedin,
  portfolio,
  jobTitle,
  professionalSummary,
  experiences,
  skills,
  education,
  certifications,
    projects,
     languages,
     referees,
  coverLetter,
}: PDFProps) {
  const includeCV = type === "cv" || type === "both";
  const includeLetter = type === "letter" || type === "both";

  return (
    <Document>
      {includeLetter && (
  <Page size="A4" style={styles.page} wrap>
    <View style={styles.letterSender}>
      <Text style={[styles.letterSenderText, { fontWeight: "bold" }]}>
        {fullName.toUpperCase()}
      </Text>
      <Text style={styles.letterSenderText}>{location}</Text>
      <Text style={styles.letterSenderText}>{phone}</Text>
      <Text style={styles.letterSenderText}>{email}</Text>
    </View>

    <View style={styles.letterDate}>
      <Text>
        {new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </Text>
    </View>

    <View style={styles.letterRecipient}>
      <Text style={{ fontWeight: "bold" }}>
        The Hiring Manager
      </Text>
      <Text>Recruitment Department</Text>
    </View>

    <Text>Dear Hiring Manager,</Text>

    <Text style={styles.letterSubject}>
      APPLICATION FOR THE POSITION OF {jobTitle.toUpperCase()}
    </Text>

    {coverLetter
      .trim()
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((paragraph, index) => (
        <Text key={index} style={styles.letterBody}>
          {paragraph.trim()}
        </Text>
      ))}

    <Text style={{ marginTop: 18 }}>
      Yours faithfully,
    </Text>
    <Text style={{ marginTop: 10 }}>
      {fullName}
    </Text>
  </Page>
)}
{includeCV && (
        <Page size="A4" style={styles.page} wrap>
          <Text style={styles.name}>{fullName}</Text>
         <Text style={styles.contact}>
  {[location, phone, email].filter(Boolean).join(" | ")}
</Text>

<Text style={{ textAlign: "center", fontSize: 11 }}>
  {jobTitle}
</Text>

{linkedin && (
  <Text style={{ textAlign: "center", marginTop: 5 }}>
    {linkedin}
  </Text>
)}

{portfolio && (
  <Text style={{ textAlign: "center", marginTop: 5 }}>
    {portfolio}
  </Text>
)}

          <Text style={styles.heading}>PROFESSIONAL SUMMARY</Text>
          <Text style={styles.paragraph}>{professionalSummary}</Text>

          {experiences.length > 0 && (
            <View>
              <Text style={styles.heading}>PROFESSIONAL EXPERIENCE</Text>

              {experiences.map((experience, index) => (
                <View key={index} style={styles.item}>
                  <Text style={{ fontWeight: "bold" }}>
                    {experience.jobTitle}
                  </Text>
                  <Text>{experience.company}</Text>

                  {experience.bullets.map((bullet, i) => (
                    <Text key={i}>• {bullet}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}
          {education.length > 0 && (
            <View>
              <Text style={styles.heading}>EDUCATION</Text>

              {education.map((item, index) => (
                <View key={index} style={styles.item} wrap={false}>
                  <Text style={{ fontWeight: "bold" }}>
                    {item.qualification}
                  </Text>

                  <Text>{item.institution}</Text>

                  {item.field_of_study && (
                    <Text>{item.field_of_study}</Text>
                  )}

                  <Text>
                    {[
                      item.start_year,
                      item.graduation_year,
                    ]
                      .filter(Boolean)
                      .join(" – ")}
                  </Text>
                </View>
              ))}
            </View>
          )}
                    {certifications.length > 0 && (
            <View>
              <Text style={styles.heading}>
                CERTIFICATIONS
              </Text>

              {certifications.map((item, index) => (
                <View
                  key={index}
                  style={styles.item}
                  wrap={false}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {item.name}
                  </Text>

                  <Text>
                    {[item.organization, item.date]
                      .filter(Boolean)
                      .join(" | ")}
                  </Text>
                </View>
              ))}
            </View>
          )}
                    {projects.length > 0 && (
            <View>
              <Text style={styles.heading}>PROJECTS</Text>

              {projects.map((item, index) => (
                <View
                  key={index}
                  style={styles.item}
                  wrap={false}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {item.name}
                  </Text>

                  {item.description && (
                    <Text>{item.description}</Text>
                  )}

                  {item.link && (
                    <Text>{item.link}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
                    {languages.length > 0 && (
            <View>
              <Text style={styles.heading}>LANGUAGES</Text>

              {languages.map((item, index) => (
                <Text key={index} style={styles.paragraph}>
                  {item.language}
                  {item.level ? ` - ${item.level}` : ""}
                </Text>
              ))}
            </View>
          )}
          <View>
  <Text style={styles.heading}>REFERENCES</Text>

  {referees.length === 0 ? (
    <Text>Available upon Request</Text>
  ) : (
    referees.map((referee, index) => (
      <View
        key={index}
        style={styles.item}
        wrap={false}
      >
        <Text style={{ fontWeight: "bold" }}>
          {referee.full_name}
        </Text>

        {referee.position && (
          <Text>{referee.position}</Text>
        )}

        {referee.organization && (
          <Text>{referee.organization}</Text>
        )}

        {referee.email && (
          <Text>{referee.email}</Text>
        )}

        {referee.phone && (
          <Text>{referee.phone}</Text>
        )}
      </View>
    ))
  )}
</View>
          {skills.length > 0 && (
            <View>
              <Text style={styles.heading}>CORE SKILLS</Text>
              <Text>{skills.join(" | ")}</Text>
            </View>
          )}
        </Page>
      )}
    </Document>
  );
}