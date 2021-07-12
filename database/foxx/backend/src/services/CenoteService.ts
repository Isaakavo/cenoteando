import { QueryFilter } from 'type-arango/dist/types';

import { Cenotes } from '../model/collections';
import { Cenote, User } from '../model/documents';

// An authenticated user
type AuthUser = User | null;

export class CenoteService {
    static listCenotes(
        user: AuthUser,
        limit: number = 250,
        continuationToken?: string,
    ): {
        data: Readonly<Cenote>[];
        hasMore: boolean;
        continuationToken: string;
    } {
        return Cenotes.paginate(limit, continuationToken, {
            filter: this.createAccessFilter(user),
        });
    }

    static getCenote(user: AuthUser, _key: string): Cenote {
        return Cenotes.findOne(_key, {
            filter: this.createAccessFilter(user),
        });
    }

    // TODO: Implement this
    static createCenote(user: AuthUser, data: never): Cenote {
        throw new Error('Not Implemented');
    }

    // TODO: Implement this
    static updateCenote(user: AuthUser, _key: string, data: never): Cenote {
        throw new Error('Not Implemented');
    }

    // TODO: Implement this
    static deleteCenote(user: AuthUser, _key: string): Cenote {
        throw new Error('Not Implemented');
    }

    private static createAccessFilter(user: AuthUser): QueryFilter {
        let filter = {};
        if (!user) filter['touristic'] = true;
        return filter;
    }
}
