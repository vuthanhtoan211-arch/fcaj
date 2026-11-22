---
title: "AWS Cloud & AI Day Vietnam 2026 – Watch Party"
date: 2026-09-29
weight: 1
chapter: false
pre: "<b>4.1.</b>"
---

# Event Report: AWS Cloud & AI Day Vietnam 2026 – Watch Party

### Event Objectives

- Stay informed about recent trends in **Cloud Computing and Artificial Intelligence**.
- Explore how AWS helps organizations apply Cloud and AI technologies to real-world challenges.
- Learn about developments in **Generative AI and Agentic AI**.
- Explore approaches for building, deploying, and modernizing applications on AWS.
- Understand the roles of Data Science, Data Engineering, and Cloud Computing in modern systems.
- Connect with the technology community and AWS enthusiasts in Southern Vietnam.
- Apply relevant lessons to my internship project.

### Speakers

- **Dr. Werner Vogels** – Chief Technology Officer (CTO), Amazon.com.
- **Eric Yeo** – Country General Manager, Malaysia, Vietnam & Indochina, Amazon Web Services.
- Other speakers from AWS and technology organizations.

### Event Highlights

#### Cloud Computing and Artificial Intelligence Trends

- Cloud Computing and AI are increasingly interconnected in modern application development.
- AWS provides services for Compute, Storage, Databases, Networking, and AI development.
- Cloud platforms support scalable and flexible AI deployments while providing tools for cost management.
- AI is moving beyond experimental models toward integration with real business workflows.
- Cloud architecture choices should reflect business requirements, data characteristics, and user needs.

#### Agentic AI

- I explored **Agentic AI** as an approach to designing AI systems capable of executing multiple steps toward specific goals.
- AI agents can use tools, APIs, data, and other services to perform more complex tasks.
- Compared with question-answering alone, Agentic AI emphasizes reasoning, planning, and action.
- This approach may benefit data management, process automation, and decision-support systems.
- The session encouraged me to consider future integration between AI, Web applications, and cloud services.

#### Builders x AI

- The **Builders x AI** theme focused on developing AI solutions that can be put into practical use.
- I learned about combining AI with Cloud services to build applications that can be deployed and scaled.
- An AI product involves more than its model: data, infrastructure, APIs, security, and operations are also essential.
- The presentations illustrated considerations for taking a technological idea from experimentation toward a more complete product.
- I recognized that understanding the problem and designing the appropriate system are as important as choosing AI technologies.

#### Data and Analytics

- Reliable data foundations are essential for analytics and AI applications.
- Data must be collected, stored, standardized, and processed before it can be used effectively for Analytics or Machine Learning.
- I gained a clearer understanding of the relationship between **Data Science, Data Engineering, Cloud Computing, and AI**.
- Data quality directly affects the accuracy of analytical results.
- Bringing information from multiple sources into a consistent workflow can reduce manual processing and improve analysis.

These lessons relate closely to my student activity management project, where information originates from the University Portal, attendance records, and Google Forms/Google Sheets before reconciliation and analysis.

#### Application Modernization on AWS

- AWS provides tools and services that help organizations modernize existing applications.
- Virtual Machines, Containers, and Serverless deployment models each have different benefits and trade-offs.
- Serverless architecture can reduce server management effort and scale based on demand.
- Multiple AWS services can be combined to support practical applications.
- A system does not have to be migrated to the Cloud all at once; components can be developed, tested, and integrated incrementally.

### Knowledge and Skills Gained

#### Thinking About Cloud and AI

- **Cloud is more than infrastructure:** it can provide a foundation for building, deploying, and operating a complete system.
- **AI requires a broader ecosystem:** a machine learning model is only one component of a larger solution.
- Real-world applications require attention to data, Compute, Storage, Database, APIs, Security, and Deployment.
- Combining Cloud, Data, and AI creates opportunities for valuable products.
- Technology choices should follow actual requirements rather than introducing unnecessary architectural complexity.

#### Technical Architecture

- I strengthened my understanding of Compute, Storage, Database, and REST API responsibilities.
- I learned about the benefits of Serverless Architecture for event-based or intermittent processing workloads.
- Frontend, Backend, Database, and Cloud services can play different roles within one application.
- Security, Access Control, and Monitoring are important parts of system design.
- A good architecture balances functionality, scalability, cost, and maintainability.

#### Data Science and Data Engineering

- Effective analytics depends on data collection, cleaning, and processing, not just final visualizations.
- I developed a better understanding of the data lifecycle, from raw sources to storage, processing, and visualization.
- Data Pipelines help process information from multiple sources.
- Analytical metrics are meaningful only when they use accurate data and consistent business rules.
- The event reinforced my interest in **Cloud Computing, Data Engineering, and Cloud & Data Engineering**.

### Applying These Lessons to My Internship Project

The event's lessons connect directly to **Student Activity Management & Engagement Analytics Platform**, the project I developed during my First Cloud AI Journey (FCAJ) internship learning program.

The project aims to centralize student activity data, reconcile participation records, and provide useful analytics for activity management.

#### Application Architecture

- Use React/Vite to develop the Web application interface.
- Use Python/FastAPI to implement the Backend and REST APIs.
- Separate Frontend, Backend, Database, and AWS service responsibilities.
- Implement Authentication and Authorization for two roles: ADMIN and STUDENT.
- Develop and test the application iteratively, adapting its architecture to project progress.

#### Data Collection and Processing

I applied Data Engineering principles to the following workflow:

1. Import student registration records exported from the University Portal.
2. Record Check-in/Check-out events in real time.
3. Import participation evidence exported from Google Forms or Google Sheets.
4. Standardize student IDs (MSSV) and validate input data.
5. Reconcile Registration, Attendance, and Evidence records.
6. Support ADMIN review and confirmation of participation.
7. Aggregate data for the Analytics Dashboard and report exports.

This process helps reduce reliance on manually consolidating multiple Excel files.

#### AWS Service Integration

The event's Cloud Architecture concepts informed my research and practical experiments with AWS services.

| AWS Service | Application in the Project |
| --- | --- |
| AWS Amplify | Deploy the React/Vite Frontend |
| Amazon DynamoDB | Explore and test Cloud storage of business data |
| Amazon S3 | Store sample input CSV files and processed JSON results |
| AWS Lambda | Develop and test a Serverless CSV processor |
| AWS IAM | Manage resource access and Lambda execution permissions |
| Amazon CloudWatch | Review Lambda execution logs, results, and duration |

The Frontend was deployed using AWS Amplify Hosting. For the demonstration, the FastAPI Backend primarily ran locally and was exposed temporarily through Cloudflare Quick Tunnel.

SQLite provided local Demo persistence, while DynamoDB was used in a separate Cloud practice environment. This does **not** mean that the complete production Backend and database were migrated to AWS.

![Architecture of the Student Activity Management & Engagement Analytics Platform](/fcaj/images/2-Proposal/student_activity_architectur.drawio.png)

#### Serverless Data Processing

A practical application of the Serverless concepts was an independent CSV processing experiment using Amazon S3 and AWS Lambda.

The workflow included:

- Reading a sample CSV file from Amazon S3.
- Validating required data fields.
- Detecting duplicate records.
- Identifying invalid records.
- Summarizing processing results.
- Writing JSON output back to Amazon S3.
- Monitoring execution through Amazon CloudWatch.

This Serverless CSV Processing experiment was implemented and tested independently from the main Web application's import functions. It provided a concrete example of Cloud Computing and Data Engineering concepts in practice.

#### Analytics Dashboard Development

The Data and Analytics sessions strengthened my interest in building a management dashboard based on consistent data.

Relevant analytical indicators include:

- Total number of activities.
- Total number of registrations.
- Check-in and Check-out counts.
- Number of students with confirmed participation.
- Activity participation rates.
- Attendance records with missing information.
- Missing participation evidence.
- Students' activity participation histories.

The current Dashboard is implemented within the React/Vite and FastAPI application. In future work, I could explore AWS Glue, Amazon Athena, and Amazon QuickSight to analyze larger volumes of historical data.

#### Future AI Applications

The Generative AI and Agentic AI topics inspired possible future enhancements:

- Analyze trends in student activity participation.
- Recommend activities based on student interests or participation history.
- Identify potentially anomalous data records.
- Build an AI assistant for activity information queries.
- Generate summary reports with AI support.

These remain **future research directions** and are not AI features implemented in the current Demo.

### My Experience at the Event

Attending **AWS Cloud & AI Day Vietnam 2026 – Watch Party** was a meaningful part of my internship learning experience. It expanded my perspective on Cloud Computing and AI and showed how AWS concepts could relate to practical engineering projects.

#### Learning from Experienced Speakers

- I had the opportunity to follow keynotes and presentations from experienced Cloud and AI professionals.
- Dr. Werner Vogels, CTO of Amazon.com, was among the prominent speakers featured in the program.
- I was also interested in Eric Yeo's insights into AWS and the development of Cloud technology.
- The presentations broadened my view of modern application development and practical AI adoption.

#### Exploring Cloud and AI Concepts

- I learned about Agentic AI, Cloud Computing, Data & Analytics, and Modern Applications.
- I gained a clearer view of how AI technologies are moving toward real use cases.
- I recognized that complete solutions combine data, infrastructure, Backend services, APIs, and user interfaces.
- I related the event's lessons to Student Activity Management & Engagement Analytics Platform.
- The experience encouraged me to continue studying AWS and improving the project's architecture.

#### Networking and Knowledge Exchange

- The Watch Party brought together people interested in AWS, Cloud Computing, and AI.
- I observed how technology communities exchange knowledge, share experiences, and discuss emerging trends.
- I realized that professional learning also benefits from participation in the wider community, beyond documentation and exercises.
- This experience motivated me to continue developing my technical skills and career direction.

#### Major Lessons

- Cloud, Data, and AI are closely connected in modern technology products.
- A real application must be considered as a complete system rather than a single algorithm or service.
- AWS knowledge needs to be combined with problem analysis and architectural thinking.
- High-quality data is fundamental to both Analytics and AI.
- Security, IAM, Monitoring, and Cost Management are necessary considerations in Cloud deployments.
- As a Data Science student, I want to strengthen my Cloud Computing and Data Engineering skills to build practical data systems.
- The event provided useful directions for further development of Student Activity Management & Engagement Analytics Platform.

### Photos from the Event

The following photographs document my attendance at **AWS Cloud & AI Day Vietnam 2026 – Watch Party**.

![Photo 1 - AWS Cloud and AI Day Vietnam 2026 Watch Party](/fcaj/images/4-Event/Event1/hinh1.jpg)

![Photo 2 - Activities at AWS Cloud and AI Day Vietnam 2026](/fcaj/images/4-Event/Event1/hinh2.jpg)

![Photo 3 - Event participation evidence](/fcaj/images/4-Event/Event1/hinh3.jpg)

### Conclusion

> Overall, AWS Cloud & AI Day Vietnam 2026 – Watch Party helped me explore developments in Cloud Computing and Artificial Intelligence while better understanding the role of data, system architecture, and AWS services in practical applications.

The event provided opportunities to connect my Data Science knowledge with Cloud Computing and Data Engineering and apply these ideas to **Student Activity Management & Engagement Analytics Platform**.

It was also an important experience that strengthened my technical thinking and clarified my interest in a future career in **Cloud & Data Engineering** after completing the First Cloud AI Journey internship program.
