import { Collection, Entities } from 'type-arango';
import { User } from '../documents';

@Collection({
    of: MeasurementOrFact,
})
export class MeasurementsOrFacts extends Entities {}
