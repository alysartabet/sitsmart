# SitSmart CSCI-380

## Challenges, Limitations, and Future Work
The two main challenges our team faced when developing the SitSmart app involved the database implementation and user verification.

### Challenge 1: DB Implementation
Originally, Jonathan and Sameer utilized a combination of **Python and PostgreSQL** to construct the tables mentioned in the Entity Relationship Diagram.
By connecting the PostgreSQL database information to the Python code in the backend folder via its URI, we were able to populate the DB with the tables and fields we desired. 
These tables were initialized in the models.py folder with the help of several Python modules (SQLAlchemy, flask_cors, etc.). Running main.py initialized these tables in the PostgreSQL database.
However, testing any external connection to the database always resulted in a *timeout error*, meaning an end user could not add their information as a user of SitSmart.
Even with troubleshooting Sameer's PostgreSQL server permissions or using an API to connect with the database, SitSmart was unable to do anything.
We resorted to migrating our current DB into an online service called Supabase; it follows the same PostgreSQL syntax, provides stronger authentication features, and removes any connection issues.
The Python code is still within the files of the project to show the earlier process, but the DB has been moved over to Supabase. 

### Challenge 2: User Verification
