/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Patient {

    constructor(patientID,firstName,lastName){
        this.patientID=patientID;
        this.firstName=firstName;
        this.lastName=lastName;
    }

    @Property()
    public patientID:string;

    @Property()
    public firstName:string;

    @Property()
    public lastName:string;

    

}