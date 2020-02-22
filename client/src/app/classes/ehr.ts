import { Utils } from './utils';
import { Symptoms } from './symptoms';
import { BloodTest } from './blood-test';

export class Ehr {

    constructor(
        public doctorID:String,
        public patientID:String,
        public ehrID:String,
        public Symptoms:Symptoms,
        public anyOtherProblem:String,
        public bloodtest:BloodTest,
        public medicines:String,
        public util:Utils,
        public patientFeedback:String
    ){}
    
}
