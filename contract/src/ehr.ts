/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Ehr {

    @Property()
    public doctorID: String;

    @Property()
    public patientID: String;

    @Property()
    public Symptoms:String

    @Property()
    public anyotherproblem:String;

    @Property()
    public bloodtest:String

    @Property()
    public medicines:String

    @Property()
    public util:String
    
    @Property()
    public patientFeedback:String;

}

// symptoms={
//     fainting:Boolean,
//     heartbeatrate:Number,
//     ChestTightness:Boolean,
//     ChestPain:Number,
//     SwellingIn:{
//         legs:Boolean,
//         feet:Boolean,
//         ankles:Boolean,
//         Abdomen:Boolean
//     },
//     weight:Number,
// }

// bloodtest={
//     wbcCount:Number,
//     rbcCount:Number,
//     totalCholestrol:Number,
//     lowDensityLipo:Number,
//     HighDensityLipo:Number,
//     triglycerides:Number
// }

// util{
//     nextAppointment:Date,
//     consultancyFees:Number,
//     paymentDone:Boolean,
//     paymentMethod:String
// }