/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Ehr {

    @Property()
    public value: String;
    public doctorID: String;
    public patientID: String

}
