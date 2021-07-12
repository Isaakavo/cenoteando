import { QueryFilter } from 'type-arango/dist/types';
import { parse } from 'json2csv';

import { MeasurementsOrFacts, Variables } from '../model/collections';
import { AccessLevel, User, ValueType, Variable } from '../model/documents';

// An authenticated user
type AuthUser = User | null;

export interface VariableValues {
    [variableKey: string]: {
        variable: Variable;
        values: {
            timestamp: string;
            value: ValueType;
        }[];
    };
}

export class VariableService {
    static listVariables(
        _: AuthUser,
        limit: number = 50,
        continuationToken?: string,
    ): {
        data: Readonly<Variable>[];
        hasMore: boolean;
        continuationToken: string;
    } {
        return Variables.paginate(limit, continuationToken);
    }

    static getVariable(_: AuthUser, _key: string): Readonly<Variable> {
        return Variables.findOne(_key);
    }

    // TODO: Implement this
    static createVariable(user: AuthUser, data: never): Readonly<Variable> {
        throw new Error('Not Implemented');
    }

    // TODO: Implement this
    static updateVariable(
        user: AuthUser,
        _key: string,
        data: never,
    ): Readonly<Variable> {
        throw new Error('Not Implemented');
    }

    // TODO: Implement this
    static deleteVariable(user: AuthUser, _key: string): void {
        throw new Error('Not Implemented');
    }

    static csv(_: AuthUser): string {
        let vars = Variables.find();
        return parse(vars, { eol: '\n' });
    }

    static getData(user: AuthUser, cenoteKey, theme): VariableValues {
        const mofs = MeasurementsOrFacts.find({ filter: { _to: cenoteKey } });
        let result: VariableValues = {};
        mofs.forEach((mof) => {
            if (!result[mof._from]) {
                const variable = Variables.findOne(mof._from, {
                    filter: VariableService.createAccessFilter(user),
                });
                if (variable.theme != theme) return;
                result[mof._from] = {
                    variable,
                    values: [],
                };
            }
            result[mof._from].values.push({
                timestamp: mof.timestamp,
                value: mof.value,
            });
        });
        return result;
    }

    private static createAccessFilter(user: AuthUser): QueryFilter {
        let accessLevels: AccessLevel[] = [AccessLevel.PUBLIC];
        if (user) accessLevels.push(AccessLevel.PRIVATE);
        if (user && user.isAdmin()) accessLevels.push(AccessLevel.SENSITIVE);
        return {
            access_level: ['IN', ...accessLevels],
        };
    }
}
