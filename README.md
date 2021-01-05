# UniCalendar
### Service Design and Engineering 2020/21 (UniTN)
##### Giulia Peserico and Roberto Negro


## Links
* Report: \
https://docs.google.com/document/d/19aDd-b3WWq1WfxOg1dvHSzBvGgbdHputSkEJ2PeBQwY

* Presentation: \
https://docs.google.com/presentation/d/1VZdYX4rfeD455by9lGGyXx5eBdiTZ_uaUpjnHta4eXs

* API documentation: \
https://unicalendar.stoplight.io

* ER diagram: \
  https://lucid.app/lucidchart/004a3d14-2963-4588-bb08-be105b9f1ff3/view
  
## Setup
In some of the services, you'll find a `secrets.example.ts` file. Rename it in `secrets.ts` and fill in the missing values as needed (i.e. Google API key, Telegram bot key, etc). 
Then setup the project with the following commands in sequence: \
`docker-compose build` \
`./initProject.sh` \
`docker-compose up`

If you need to change something in a specific service, open a new terminal window and move inside of the folder of that service, and execute the command `yarn` before doing any change. This will install all the Node.js dependencies.

Use, when needed, the following command to clear out the database and reinitialize them with the new schema definitions.
`./resetDbs.sh`
