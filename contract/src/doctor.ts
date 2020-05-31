/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Doctor {

    constructor(doctorId,firstName,lastName,password){
        this.doctorId=doctorId;
        this.firstName=firstName;
        this.lastName=lastName;
        this.password=password;
    }

    @Property()
    public doctorId:string;

    @Property()
    public firstName:string;

    @Property()
    public lastName:string;

    @Property()
    public password:string;

}