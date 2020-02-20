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
    public async ehrExists(ctx: Context, ehrID: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(ehrID);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction(false)
    @Returns('boolean')
    public async patientExists(ctx: Context, patientID: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(patientID);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createEhr(ctx: Context,args:string): Promise<void> {
      let argsJSON=JSON.parse(args) as Ehr;
        const exists = await this.ehrExists(ctx, argsJSON.ehrID);
        if (exists) {
            throw new Error(`The ehr ${argsJSON.ehrID} already exists`);
        }
        const ehr = new Ehr();
        ehr.doctorID=argsJSON.doctorID;
        ehr.patientID=argsJSON.patientID;
        ehr.Symptoms=argsJSON.Symptoms;
        ehr.anyOtherProblem=argsJSON.anyOtherProblem;
        ehr.bloodtest=argsJSON.bloodtest;
        ehr.medicines=argsJSON.medicines;
        ehr.util=argsJSON.util;
        ehr.patientFeedback=argsJSON.patientFeedback;
        const buffer = Buffer.from(JSON.stringify(ehr));
        await ctx.stub.putState(argsJSON.ehrID, buffer);
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
    public async updateEhr(ctx: Context, ehrId: string, newValue: string): Promise<void> {
        const exists = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        const ehr = new Ehr();
        
        const buffer = Buffer.from(JSON.stringify(ehr));
        await ctx.stub.putState(ehrId, buffer);
    }

    @Transaction()
    public async deleteEhr(ctx: Context, ehrId: string): Promise<void> {
        const exists = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        await ctx.stub.deleteState(ehrId);
    }

    @Transaction()
    public async updateDoctorOnEhr(ctx: Context, args:string): Promise<void> {
        let argsJSON=JSON.parse(args);
        console.log(argsJSON);
        const exists = await this.ehrExists(ctx, argsJSON.ehrID);
        if (!exists) {
            throw new Error(`The ehr ${argsJSON.ehrID} does not exist`);
        }
        const ehr = new Ehr();
        ehr.doctorID = argsJSON.doctorID;
        const buffer = Buffer.from(JSON.stringify(ehr));
        await ctx.stub.putState(argsJSON.ehrID, buffer);
    }


    @Transaction()
    public async createDoctor(ctx:Context,args:string){
        let newArgs=JSON.parse(args);
        let newDoctor=new Doctor(newArgs.doctorID,newArgs.firstName,newArgs.lastName);
        await ctx.stub.putState(newDoctor.doctorID, Buffer.from(JSON.stringify(newDoctor)));
    }

    @Transaction()
    public async createPatient(ctx:Context,args:string){
        let newArgs=JSON.parse(args);
        let newPatient={patientID:newArgs.patientID,firstname:newArgs.firstname,lastname:newArgs.lastname};
        await ctx.stub.putState(newPatient.patientID, Buffer.from(JSON.stringify(newPatient)));
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


}
