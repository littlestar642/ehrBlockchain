# DoctorDap

A hyperledger fabric blockchain application that is mainly concerened with the management of Electronic Health Records (EHR) in a private permissioned blockchain.

## Prerequisites

Ubuntu OS 16.04
VSCode- version 1.39
npm- version 6.x
node- version 10.x.x
angular- version 9.1.7
docker extension- version 0.82
IBM Blockchain Platform- version 1.0.28

## How to run

1. Open the Contract folder with VSCode.

2. Go to block chain platform and select package open project as shown in the figure below:

![homepage](/screenshots/pkg_open_proj.png)


3. Now close this VSCode.  Go back to the main folder and open this folder in VSCode.

4. Now again go to the block chain extension. Export the wallet Org1 as shown in figure below by placing it in the server folder and rename it to wallet. 

![homepage](/screenshots/exp_wallet.png)

5. You will notice the presence of packaged project from previous step. Now connect to the environment by clicking on 1 Org Local Fabric.  On successful connection the VSCode editor will prompt you a message.

6.  On successful connection you will get various options in the environment pane on the left.  Here install the package as shown in figure below:

![homepage](/screenshots/install_pkg.png)

7. Now instantiate the installed package in the same pane by following the figure:

![homepage](/screenshots/instantiate_pkg.png)

8. Now  open  your  Ubuntu  terminal  in  the server folder  and  run  command `node src/app.js`.  This will run a server listening on port 8000.

9. Open new Ubuntu terminal in the client folder and run command `ng serve`.  This will setup a server listening on port 4200.

10. Access the homepage of our application by going to `https://localhost:4200/homepage`.  This completes run procedure of our system. This system can now be used by the user. 

## Vision of the Product

To create a consortium of worldwide healthcare institutions to record and manipulate the EHRs using our dapp. Later with evolution of blockchain technologies, we can also create a network of networks to easily manage the data for any patient-doctor consultation.

## Reason for building the Product

1. If you google about EHRs in blockchain you might get number of papers and research done but very few applications that have actually implemented the chaincode in action. We want to be amongst the first individuals to create such a permissioned ledger.

2. Maintaining health records turns into a huge mess when the volume increases mere 10 to 15 papers. With an electronic health record management system we remove the tangibile nature of such records and hence dematerialise them.

3. Using the hyperledger fabric, we can easily maintain the hisorical records for any user referenced by their userID. This is a great help when it comes to accessing previous records and prevents tampering of the data by any sorts.

## Uniqueness of the Product

As already mentioned, there are very few applications which are actually built for mainitaining the EHRs in a blockchain. On top of that we are also providing a fully featured angular application that integrated very easily with our backend. 

We have done an extensive research on the topic and have come up with a unique way of accessing the EHRs and that is with the help of One Time Password (OTPs). OTPs provide a trustable method of reconciling to the fact that the patient and doctor are in contact whenever a manipulation to the EHR is made. A doctor cant just change that on his own.

As of now we are providing cardiology related diagnosis parameters in the application. It is expected that as a future work we will build over this and extend it to contain most of the medical diagnosis domains.

## Building the Platform

1. Frontend - Angular
2. Backend - NodeJS
3. Blockchain - Hyperledger fabric
4. Development - IBM blockchain platform VSCode extension.

## Screenshots of the Application

### homepage
![homepage](/screenshots/home.png)

### Doctor Dashboard
![dashboard](/screenshots/doctorHome.png)

### Patient consent through OTP
![consent](/screenshots/consent.png)

### Diagnosis form for Doctor
![diagnosis](/screenshots/diagnosis.png)

### EHR record
![ehr](/screenshots/ehr.png)


