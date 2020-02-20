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
    public ehrID:string;

    @Property()
    public doctorID:string;

    @Property()
    public patientID:string;

    @Property()
    public Symptoms:Symptoms;

    @Property()
    public anyOtherProblem:string;

    @Property()
    public bloodtest:Bloodtest

    @Property()
    public medicines:string

    @Property()
    public util:Utils
    
    @Property()
    public patientFeedback:string;

}