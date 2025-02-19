# User Management Frontend Task
Yo can see live site over [here](https://user-management-kombee-task.netlify.app/sign-in).

## Site Installation

Run Installation comands and start servers

```bash
  npm install
  npm run dev
```

## env setup
You will need env setup
So follow the following command
```bash
  cp .env.example .env.local
```

## About task

#### Points Which are not completed due to time limitation
Note: below mention points are not completed due to the time limete

- Add and edit user functionality 
- Responsive design and 404 page design
- for delete functionality currently I've not use api 

#### Points Which are not completed due to improper APIs
Note: below mention points are not completed due to improper guidance of the api in postman collection

- Filter for role
  - I found the api for list of roles which are available through out the site but what I need to pass from role object to get filter work. That I could not able to find. Additionally I have tried it to work with role name and id of the role which two properties were present in the response of list role api alse were null. but none of them was the right one. and there is no documentation that what I need to pass for filter the role out.

####  Except above mention two points all the functionalities are done
