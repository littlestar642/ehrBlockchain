/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';
import {Bloodtest} from "./properties/BloodTest"
import {Symptoms} from "./properties/Symptoms"
import {Utils} from "./properties/Util"

@Object()
export class Ehr {

    @Property()
    public doctorID: String;

    @Property()
    public patientID: String;

    @Property()
    public Symptoms:Symptoms;

    @Property()
    public anyOtherProblem:String;

    @Property()
    public bloodtest:Bloodtest

    @Property()
    public medicines:String

    @Property()
    public util:Utils
    
    @Property()
    public patientFeedback:String;

}