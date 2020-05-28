/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Ehr } from './ehr';
import { Doctor } from './doctor';
import { Symptoms } from './properties/Symptoms';
import { Bloodtest } from './properties/BloodTest';
import { Utils } from './properties/Util';

@Info({title: 'EhrContract', description: 'My Smart Contract' })
export class EhrContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async ehrExists(ctx: Context, args: string): Promise<boolean> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.ehrId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction(false)
    @Returns('boolean')
    public async patientExists(ctx: Context, args: string): Promise<boolean> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.patientId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction(false)
    @Returns('boolean')
    public async getPatient(ctx: Context, args: string): Promise<string> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.patientId);
        return buffer.toString();
    }

    @Transaction(false)
    @Returns('boolean')
    public async checkPatientPass(ctx: Context, args:string): Promise<boolean> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.doctorId);
        let doctor=JSON.parse(buffer.toString());
        return doctor.password==newObj.password;
    }

    @Transaction(false)
    @Returns('boolean')
    public async doctorExists(ctx: Context, args:string): Promise<boolean> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.doctorId);
        if(!this.checkDoctorPass(ctx,args))throw new Error('password does not match');

        return (!!buffer && buffer.length > 0);
    }

    @Transaction(false)
    @Returns('boolean')
    public async checkDoctorPass(ctx: Context, args:string): Promise<boolean> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.doctorId);
        let doctor=JSON.parse(buffer.toString());
        return doctor.password==newObj.password;
    }

    @Transaction(false)
    @Returns('boolean')
    public async getMailIdOfPatient(ctx: Context, args:string): Promise<string> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.patientId);
        let patient=JSON.parse(buffer.toString());
        let mail=patient.emailId;
        return mail;
    }

    @Transaction(false)
    @Returns('boolean')
    public async checkPatientPassword(ctx: Context, args:string): Promise<boolean> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.patientId);
        let patient=JSON.parse(buffer.toString());
        return newObj.password==patient.password;
    }

    @Transaction(false)
    @Returns('boolean')
    public async patientHasPassword(ctx: Context, args:string): Promise<boolean> {
        let newObj=JSON.parse(args);
        const buffer = await ctx.stub.getState(newObj.patientId);
        let patient=JSON.parse(buffer.toString());
        return typeof patient.password=="string";
    }

    @Transaction()
    public async createEhr(ctx: Context,args:string): Promise<Boolean> {
      let argsJSON=JSON.parse(args) as Ehr;

        let patientExists=await this.patientExists(ctx,args);
        if(!patientExists)throw new Error("patient does not exist");

        let ehrExists=await this.ehrExists(ctx,args);
        if(ehrExists)throw new Error("Ehr with the same ID already exists");

        let doctorExists=await this.doctorExists(ctx,args);
        if(!doctorExists)throw new Error('doctor does not exist');
        
        const ehr = new Ehr();
        ehr.doctorId=argsJSON.doctorId;
        ehr.patientId=argsJSON.patientId;
        ehr.Symptoms=JSON.parse(JSON.stringify(argsJSON.Symptoms)) as Symptoms;
        ehr.anyOtherProblem=argsJSON.anyOtherProblem;
        ehr.bloodtest=JSON.parse(JSON.stringify(argsJSON.bloodtest)) as Bloodtest;
        ehr.medicines=argsJSON.medicines;
        ehr.util=JSON.parse(JSON.stringify(argsJSON.util)) as Utils;
        ehr.patientFeedback=argsJSON.patientFeedback;
        ehr.ehrId=argsJSON.ehrId;
        const buffer = Buffer.from(JSON.stringify(ehr));
        await ctx.stub.putState(argsJSON.ehrId, buffer);
        return true;
    }

    @Transaction(false)
    @Returns('Ehr')
    public async readEhr(ctx: Context, ehrId: string): Promise<Ehr> {
        const exists = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        const buffer = await ctx.stub.getState(ehrId);
        const ehr = JSON.parse(buffer.toString()) as Ehr;
        return ehr;
    }

    @Transaction()
    public async updateEhr(ctx: Context, ehrId: string, newValue: string): Promise<Boolean> {
        const exists = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        const ehr = new Ehr();
        
        const buffer = Buffer.from(JSON.stringify(ehr));
        await ctx.stub.putState(ehrId, buffer);
        return true;
    }

    @Transaction()
    public async deleteEhr(ctx: Context, ehrId: string): Promise<Boolean> {
        const exists = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        await ctx.stub.deleteState(ehrId);
        return true;
    }

    @Transaction()
    public async updateDoctorOnEhr(ctx: Context, args:string): Promise<Boolean> {
        let argsJSON=JSON.parse(args);
        const exists = await this.ehrExists(ctx, argsJSON.ehrID);
        if (!exists) {
            throw new Error(`The ehr ${argsJSON.ehrID} does not exist`);
        }
        let buffer = await ctx.stub.getState(argsJSON.ehrID);
        let newJson=JSON.parse(buffer.toString())
        newJson.doctorId = argsJSON.doctorId;
        buffer = Buffer.from(JSON.stringify(newJson));
        await ctx.stub.putState(argsJSON.ehrID, buffer);
        return true;
    }


    @Transaction()
    public async createDoctor(ctx:Context,args:string):Promise<Boolean>{
        let newArgs=JSON.parse(args);
        let newDoctor=new Doctor(newArgs.doctorId,newArgs.firstName,newArgs.lastName,newArgs.password);
        await ctx.stub.putState(newDoctor.doctorId, Buffer.from(JSON.stringify(newDoctor)));
        return true;
    }

    @Transaction()
    public async createPatient(ctx:Context,args:string):Promise<Boolean>{
        let newArgs=JSON.parse(args);
        let newPatient={patientId:newArgs.patientId,firstname:newArgs.firstname,lastname:newArgs.lastname,doctorId:newArgs.doctorId,emailId:newArgs.emailId,password:newArgs.password};
        await ctx.stub.putState(newPatient.patientId, Buffer.from(JSON.stringify(newPatient)));
        return true;
    }

    @Transaction()
    public async setPatientPassword(ctx:Context,args:string):Promise<Boolean>{
        let newArgs=JSON.parse(args);

        let patient=await ctx.stub.getState(newArgs.patientId)
        let patientJson=JSON.parse(patient.toString());
        patientJson.password=newArgs.password;
        await ctx.stub.putState(newArgs.patientId, Buffer.from(JSON.stringify(patientJson)));
        return true;
    }






    
    @Transaction(false)
    public async queryWithQueryString(ctx:Context, queryString:string) {

        console.log('query String');
        console.log(JSON.stringify(queryString));
    
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
    
        let allResults = [];
    
        // eslint-disable-next-line no-constant-condition
        while (true) {
          let res = await resultsIterator.next();
    
          if (res.value && res.value.value.toString()) {
            let jsonRes = {Key:"",Record:{}};
    
            console.log(res.value.value.toString('utf8'));
    
            jsonRes.Key = res.value.key;
    
            try {
              jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
            } catch (err) {
              console.log(err);
              jsonRes.Record = res.value.value.toString('utf8');
            }
    
            allResults.push(jsonRes);
          }
          if (res.done) {
            console.log('end of data');
            await resultsIterator.close();
            console.info(allResults);
            console.log(JSON.stringify(allResults));
            return JSON.stringify(allResults);
          }
        }
      }

    @Transaction(false)
    public async queryByObjectType(ctx:Context, objectType:string) {

        let queryString = {
          selector: {
            type: objectType
          }
        };
    
        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;
    
      }

    @Transaction(false)
    public async queryByEhr(ctx:Context, ehrID:string) {

        let queryString = {
          selector: {
            ehrID: ehrID
          }
        };
    
        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;
    
      }

      @Transaction(false)
      public async queryByPatientID(ctx:Context, args:string) {
          let newObj=JSON.parse(args);


          let patientId=newObj.patientId;

          let patientExists=await this.patientExists(ctx,args);
          if(!patientExists)throw new Error('patient does not exist')
          
          let queryString = {
            selector: {
              patientId: patientId
            }
          };
      
          let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
          return queryResults;
      
        }


}