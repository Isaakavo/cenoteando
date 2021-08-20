import { QueryFilter } from 'type-arango/dist/types';
import { parse } from 'json2csv';

import { Users } from '../model/collections';
import { User, UserRole } from '../model/documents';

// An authenticated user
type AuthUser = User | null;

export class UserService {
    // TODO: Identify functions needed for UserService

    private static createReadFilter(user: AuthUser): QueryFilter {
        let filter = {};
        // If user is not authenticated, restrict access by filtering on an unused property
        if (!user) filter['___not_allowed___'] = true;
        else if (user && user.role == UserRole.ADMIN) filter = {};
        else filter['_key'] = user._key;
        return filter;
    }

    static verifyUser(email: string, password: string): User {
        const user = Users.findOne({ filter: { email } });
        if (!user) {
            throw new Error('Invalid email.');
        }
        if (!user.validPassword(password)) {
            throw new Error('Invalid password.');
        }
        return user;
    }

    static getUser(user: AuthUser, _key: string): User {
        const filter = UserService.createReadFilter(user);
        return Users.findOne(_key, { filter, unset: ['password'] });
    }

    static listUsers(
        user: AuthUser,
        limit = 250,
        continuationToken?: string,
    ): {
        data: Readonly<User>[];
        hasMore: boolean;
        continuationToken: string;
    } {
        return Users.paginate(limit, continuationToken, {
            filter: UserService.createReadFilter(user),
            unset: ['password'],
        });
    }

    static createUser({ email, name, password }): User {
        if (UserService.userExists(email))
            // TODO: Throw custom error
            throw Error(
                `UserService.createUser: User with same email already exists. email = ${email}.`,
            );

        const user = new User({
            email,
            name,
            password,
            role: UserRole.CENOTERO,
        });
        user.insert();
        return user;
    }

    // TODO: Implement this
    static updateUser(
        authUser: AuthUser,
        _key: string,
        data: any,
    ): Readonly<User> {
        if (!authUser?.isAdmin())
            throw new Error(
                `UserService.updateUser: User does not have update permissions. user._key = ${_key}.`,
            );

        const user = Users.findOne(_key);
        // TODO: Check same key
        // TODO: Check valid data
        user.merge(data);
        user.save();
        return user;
    }

    static deleteUser(authUser: AuthUser, _key: string): void {
        if (!authUser?.isAdmin())
            throw new Error(
                `UserService.deleteUser: User does not have delete permissions. user._key = ${_key}.`,
            );

        const user = Users.findOne(_key);
        user.remove();
    }

    static toCsv(authUser: AuthUser): string {
        if (!authUser?.isAdmin())
            throw new Error(
                `UserService.toCsv: User does not have read permissions.`,
            );
        const users = Users.find({
            filter: this.createReadFilter(authUser),
            unset: ['password'],
        });
        return parse(users, { eol: '\n' });
    }

    static userExists(email: string): boolean {
        try {
            const user = Users.findOne({
                filter: { email },
            });
            return !!user;
        } catch (e) {
            return false;
        }
    }
}
