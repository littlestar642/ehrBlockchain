/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Doctor {

    constructor(doctorID,firstName,lastName){
        this.doctorID=doctorID;
        this.firstName=firstName;
        this.lastName=lastName;
    }

    @Property()
    public doctorID:string;

    @Property()
    public firstName:string;

    @Property()
    public lastName:string;

    

}