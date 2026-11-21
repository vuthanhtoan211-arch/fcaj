
---
title: "Blog 3 - From Amazon S3 to an Analytics Dashboard"
date: 2026-09-18
weight: 3
chapter: false
pre: "<b>3.3.</b>"
---

# FROM S3 DATA FILES TO DASHBOARDS: BUILDING A DATA ANALYTICS PIPELINE WITH GLUE, ATHENA, AND QUICKSIGHT

## The Journey from Raw Data to Valuable Insights on AWS

### 1. When Data Goes Beyond Excel Files

As a Data Science student, I frequently work with data cleaning, data analysis, and visualization.

However, while studying Cloud Computing at First Cloud AI Journey (FCAJ), I encountered another important question:

**How can a collection of data files stored in the Cloud be transformed into a Dashboard that supports decision-making?**

In my Student Activity Management & Engagement Analytics Platform project, data is collected from multiple sources:

* Registration data from the University Portal.
* Attendance data from Check-in and Check-out operations.
* Participation evidence from Google Forms or Google Sheets.
* Participation results from reconciliation and confirmation.

After processing, the system can help answer questions such as:

* How many students registered for an activity?
* How many students were confirmed as participants?
* What is the participation rate?
* How many students are missing Check-in or Check-out records?
* Which activities have the highest engagement?
* How does participation change across semesters?

These questions helped me understand that the value of data is not limited to storage. It also depends on how effectively the data can be analyzed and used.

### 2. An AWS Data Analytics Architecture

While researching the original project architecture, I studied an analytical model combining:

* Amazon S3.
* AWS Glue.
* Amazon Athena.
* Amazon QuickSight.

The overall workflow is:

```text
Student Activity Data
          |
          v
Amazon S3
Raw Data
          |
          v
Data Cleaning & Transformation
          |
          v
Amazon S3
Curated Analytics Data
          |
          +------------------------+
          |                        |
          v                        v
AWS Glue Data Catalog       Amazon Athena
          |                        |
          +---- Table Metadata --->+
                                   |
                                   v
                          Amazon QuickSight
                          Analytics Dashboard
```

Each service has a different responsibility in transforming raw data into analytical insights.

This architecture represents research and a potential future enhancement. The current MVP uses an Analytics Dashboard developed directly with React/Vite and FastAPI.

### 3. Amazon S3: Where the Data Journey Begins

Amazon S3 is an object storage service that supports different types of data, including CSV, JSON, images, documents, and analytical formats such as Parquet.

In an Analytics architecture, S3 can serve as the underlying data storage platform.

For example, student activity data could be organized using the following structure:

```text
s3://student-activity-analytics-demo/

  raw/
    registrations/
    attendance/
    evidence/

  curated/
    participation/
      year=2026/
        semester=1/
          activity_id=ACT001/

  query-results/
```

The purpose of each area is:

* raw/: Original data from different source systems.
* curated/: Validated, standardized, and processed data.
* query-results/: Amazon Athena query results.

Organizing data into separate layers helps distinguish original data from datasets that are ready for analysis.

For larger datasets, Parquet and partitioning by year, semester, or Activity ID can help reduce the amount of data scanned during queries.

### 4. Data Cleaning: Why Raw Files Are Not Always Ready for Analysis

Data collected from multiple sources often has different structures.

For example, a Registration file might contain:

```csv
student_id,full_name,activity_id
0818000001,Student A,ACT001
0818000002,Student B,ACT001
0818000003,Student C,ACT001
```

Attendance data might contain:

```csv
student_id,activity_id,check_in,check_out
0818000001,ACT001,08:05,11:30
0818000002,ACT001,08:10,
```

Evidence data:

```csv
student_id,activity_id,evidence_submitted
0818000001,ACT001,true
0818000002,ACT001,true
```

Simply uploading these files to S3 does not make them immediately suitable for analytics.

The following processing steps are required:

1. Standardize column names.
2. Preserve student IDs as strings.
3. Validate missing data.
4. Detect duplicate records.
5. Standardize timestamps.
6. Match records using Student ID and Activity ID.
7. Consolidate participation status.
8. Create an analytical dataset.

The processed dataset could look like this:

```csv
student_id,activity_id,registered,checked_in,checked_out,evidence_submitted,participation_status
0818000001,ACT001,true,true,true,true,CONFIRMED
0818000002,ACT001,true,true,false,true,PENDING
0818000003,ACT001,true,false,false,false,REJECTED
```

This synthetic dataset illustrates possible reconciliation results.

PENDING represents a record awaiting confirmation in this example. CONFIRMED and REJECTED decisions must follow the applicable business rules and ADMIN review.

### 5. AWS Glue: Helping the System Understand Data Structures

AWS Glue is a data integration service that supports data cataloging and Extract, Transform, Load (ETL) workloads.

In this architecture, the main component I studied was the AWS Glue Data Catalog.

The Data Catalog stores metadata such as:

* Database names.
* Table names.
* Column definitions.
* Data types.
* S3 data locations.
* Partition information.

Example:

```text
Database:
student_activity_analytics

Table:
student_participation

Data Location:
s3://student-activity-analytics-demo/curated/participation/

Columns:
student_id            string
activity_id           string
registered            boolean
checked_in            boolean
checked_out           boolean
evidence_submitted    boolean
participation_status  string
```

An AWS Glue Crawler can scan data stored in Amazon S3 and create or update table definitions in the Data Catalog.

An important concept is:

**The AWS Glue Data Catalog stores metadata describing the data, rather than all the actual records stored in S3.**

For more complex ETL requirements, AWS Glue Jobs can be used to clean, transform, and convert data formats.

However, running a Crawler alone does not automatically clean the dataset.

### 6. Amazon Athena: Analyzing Data with SQL

Amazon Athena is a service that allows SQL queries against data stored in Amazon S3 without requiring users to manage database servers directly.

Athena can use table definitions from the AWS Glue Data Catalog to identify data locations and structures.

After creating the student_participation table, I can study analytical queries such as the following.

#### 6.1. Total Registrations

```sql
SELECT COUNT(*) AS total_registrations
FROM student_participation
WHERE registered = TRUE;
```

This query counts registered records.

The dataset should contain one record per student and activity to avoid duplicate counting.

#### 6.2. Confirmed Participants

```sql
SELECT COUNT(*) AS confirmed_participants
FROM student_participation
WHERE participation_status = 'CONFIRMED';
```

This metric represents the number of confirmed participation records.

#### 6.3. Participation Rate by Activity

```sql
SELECT
    activity_id,
    COUNT(*) AS total_registrations,
    SUM(
        CASE
            WHEN participation_status = 'CONFIRMED'
            THEN 1
            ELSE 0
        END
    ) AS confirmed_participants,
    ROUND(
        100.0 * SUM(
            CASE
                WHEN participation_status = 'CONFIRMED'
                THEN 1
                ELSE 0
            END
        ) / NULLIF(COUNT(*), 0),
        2
    ) AS participation_rate
FROM student_participation
WHERE registered = TRUE
GROUP BY activity_id;
```

The rate is calculated using confirmed participants among registered students.

#### 6.4. Identifying Missing Check-out Records

```sql
SELECT
    student_id,
    activity_id,
    checked_in,
    checked_out
FROM student_participation
WHERE checked_in = TRUE
  AND checked_out = FALSE;
```

The results help organizers identify students requiring further review.

#### 6.5. Identifying Missing Evidence

```sql
SELECT
    student_id,
    activity_id
FROM student_participation
WHERE checked_in = TRUE
  AND evidence_submitted = FALSE;
```

This query identifies students with attendance records but missing participation evidence.

These SQL queries are illustrative research examples. They do not represent Athena queries already deployed in my internship project.

### 7. Amazon QuickSight: Transforming Query Results into Dashboards

Amazon QuickSight is an AWS Business Intelligence tool that supports data analysis and visualization.

In this architecture, QuickSight can connect to Athena and use analytical data to build Dashboards.

Instead of reviewing thousands of Excel rows, organizers can monitor important indicators through charts and summary tables.

The proposed Dashboard includes:

| Component | Purpose |
| --- | --- |
| KPI Cards | Total registrations, participation, and participation rate |
| Bar Chart | Compare engagement across different activities |
| Line Chart | Track participation trends over time |
| Donut Chart | Display the distribution of participation statuses |
| Data Table | Review records by Student ID or activity |
| Filters | Filter results by semester, activity, or data group |

Illustrative example:

```text
Total Registrations: 1,200

Confirmed Registered Participants: 1,050

Participation Rate: 87.5%
```

Participation Rate is calculated as:

```text
Participation Rate
= Confirmed Registered Participants
  / Total Registrations × 100

= 1,050 / 1,200 × 100

= 87.5%
```

These are synthetic figures used to illustrate Dashboard metrics, not actual measurements from a university activity.

### 8. A Guide to Building an Experimental Analytics Pipeline

The following walkthrough provides a reference exercise for AWS beginners.

#### Step 1: Prepare the Data

* Create a synthetic CSV dataset.
* Standardize column names.
* Validate student IDs and duplicate records.
* Add a Participation Status field.
* Avoid using personal information without authorization.

#### Step 2: Create an Amazon S3 Bucket

* Create a private S3 Bucket.
* Maintain appropriate Block Public Access settings.
* Create a curated/participation/ prefix.
* Upload the standardized CSV file.
* Prepare an Athena query results location.

#### Step 3: Configure the AWS Glue Data Catalog

* Create a Glue Database named student_activity_analytics.
* Create a Crawler using the curated/participation/ S3 location.
* Configure an IAM Role with the required S3 read permissions.
* Run the Crawler.
* Verify the generated Table and Data Types.

Ensure that student_id and activity_id are recognized as strings to preserve identifier values correctly.

#### Step 4: Query Data with Amazon Athena

* Open the Athena Query Editor.
* Select the configured Database.
* Configure the Query Results location.
* Run an initial SELECT query.
* Verify the results and data types.
* Develop analytical SQL queries.

#### Step 5: Build a Dashboard with Amazon QuickSight

* Configure QuickSight access to Athena and S3.
* Create an Athena Data Source.
* Select the Database and Table.
* Create a Dataset.
* Develop an Analysis.
* Add KPIs, charts, and Filters.
* Publish the Dashboard if sharing is required.

QuickSight can use Direct Query or SPICE depending on analytical requirements and configuration.

#### Step 6: Review Costs and Clean Up Resources

* Review Glue Crawler executions.
* Review the amount of data scanned by Athena.
* Review S3 Storage usage.
* Review QuickSight subscriptions and SPICE usage where applicable.
* Remove unused experimental resources.
* Check AWS Billing.

### 9. Performance and Cost Optimization

An important consideration when studying AWS Data Analytics is processing cost.

Potential optimization strategies include:

**Use Parquet**

Parquet is a columnar storage format that can allow Athena to read only the required columns rather than the entire dataset.

**Partition Data**

Partitioning data by year, semester, or Activity ID can reduce data scans when appropriate filters and table structures are used.

**Avoid Unnecessary SELECT star Queries**

Select only the columns required for analysis.

**Control Glue Executions**

Run Crawlers or ETL Jobs when metadata updates or data processing are required.

**Manage QuickSight Resources**

Choose suitable query modes, SPICE capacity, and subscription options according to actual analytical requirements.

These strategies help develop scalable analytics systems while maintaining cost awareness.

### 10. Data Security in Analytics Pipelines

Student activity records may contain personal information such as student IDs, names, classes, and participation history.

An Analytics architecture should consider:

* Keeping S3 Buckets containing student records private.
* Applying IAM Least Privilege permissions.
* Restricting access to authorized users.
* Using appropriate encryption.
* Excluding unnecessary personal information from Dashboards.
* Using synthetic data for learning and demonstrations.
* Controlling Dashboard sharing permissions.

Not every user needs access to detailed student records.

A management Dashboard may only require aggregated statistics rather than access to the complete raw dataset.

### 11. Comparison with the Current Internship Project

| Component | Current Project | Researched Architecture |
| --- | --- | --- |
| Operational Database | SQLite and DynamoDB Integration | Data can be exported to analytical storage |
| File Storage | Amazon S3 in the Demo | S3 Raw/Curated Data |
| Data Processing | FastAPI and Lambda CSV Demo | Glue ETL or other processing tools |
| Metadata | Application data structures | AWS Glue Data Catalog |
| Query | FastAPI business data processing | Amazon Athena SQL |
| Dashboard | React/Vite | Amazon QuickSight |

The current version of my project uses React/Vite and FastAPI to provide an Analytics Dashboard.

The Glue, Athena, and QuickSight architecture represents a potential enhancement for:

* Long-term historical data analysis.
* Cross-activity and cross-semester analysis.
* Querying larger analytical datasets.
* Separating Analytics from daily operational workflows.
* Developing Business Intelligence reports.

AWS Glue, Amazon Athena, and Amazon QuickSight have not been confirmed as implemented components of the current MVP.

### 12. Lessons Learned

Through studying an AWS Data Analytics Pipeline, I developed a better understanding of different Data Engineering responsibilities:

* Data Ingestion: Collecting and importing data.
* Data Storage: Storing data using Amazon S3.
* Data Processing: Cleaning and transforming data.
* Data Catalog: Managing metadata using AWS Glue.
* Data Query: Querying datasets using Amazon Athena.
* Data Visualization: Presenting insights using Amazon QuickSight.

An attractive Dashboard is only the final stage of the workflow.

The quality of analytical results also depends on data accuracy, schema design, processing rules, and consistent definitions of business metrics.

### 13. Conclusion

Starting with CSV files stored in Amazon S3, I can understand how an end-to-end Data Analytics workflow could be built on AWS.

AWS Glue manages metadata and supports data integration. Amazon Athena provides SQL querying capabilities. Amazon QuickSight transforms analytical results into charts and Dashboards.

I learned that Data Engineering is not limited to a single tool or service.

It involves connecting multiple components so that data can be collected, stored, standardized, processed, and analyzed effectively.

This knowledge helps me connect my Data Science background with Cloud Computing and provides a clearer direction for my future development in Cloud & Data Engineering.

### 14. References

* [Amazon S3 Documentation](https://docs.aws.amazon.com/s3/)
* [AWS Glue Documentation](https://docs.aws.amazon.com/glue/)
* [AWS Glue Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html)
* [Amazon Athena User Guide](https://docs.aws.amazon.com/athena/latest/ug/what-is.html)
* [Amazon Athena Performance Tuning](https://docs.aws.amazon.com/athena/latest/ug/performance-tuning.html)
* [Amazon QuickSight User Guide](https://docs.aws.amazon.com/quicksight/latest/user/welcome.html)
* [AWS Analytics](https://aws.amazon.com/big-data/datalakes-and-analytics/)
* [AWS Pricing Calculator](https://calculator.aws/)
