import createRouter from '@arangodb/foxx/router';
import Joi from 'joi';
import dd from 'dedent';

import { ReferenceService } from '../services';
import { User } from '../model/documents';
import { ReferenceSchema } from '../model/schema';

export default (): Foxx.Router => {
    const router = createRouter();

    // TODO: Test this
    // TODO: Error handling
    router
        .get((req, res) => {
            let user: User | null = null;
            if (req.session && req.session.data)
                user = new User(req.session.data);
            res.send(ReferenceService.getReferences(user));
        })
        .summary('Get References')
        .description('Fetches all known references.')
        .response(
            'ok',
            Joi.array().items(ReferenceSchema).required(),
            ['application/json'],
            'All references',
        );

    // TODO: Test this
    // TODO: Error handling
    router
        .get(':_key', (req, res) => {
            let user: User | null = null;
            if (req.session && req.session.data)
                user = new User(req.session.data);
            res.send(
                ReferenceService.getReferenceByKey(user, req.pathParams._key),
            );
        })
        .summary('Get a reference by key')
        .description('Fetches a specific reference by key.')
        .response(
            'ok',
            ReferenceSchema.required(),
            ['application/json'],
            'The reference requested',
        );


    router
        .post((req, res) => {
            let user: User | null = null;
            if (req.session && req.session.data)
                user = new User(req.session.data);
            res.send(ReferenceService.createReference(user, req.body));
        })
        .body(ReferenceSchema.required(), 'The variable data to create.')
        .summary('Create a reference.')
        .description('Creates reference with information given.')
        .response(
            'created',
            ReferenceSchema.required(),
            ['application/json'],
            'The created reference.',
        );

        
    // TODO: Test this
    // TODO: Error handling
    router
        .put(':_key', (req, res) => {
            let user: User | null = null;
            if (req.session && req.session.data)
                user = new User(req.session.data);
            res.send(
                ReferenceService.updateReference(
                    user,
                    req.pathParams._key,
                    req.body,
                ),
            );
        })
        .body(ReferenceSchema.required(), 'The reference data to update.')
        .summary('Update a reference.')
        .description('Updates information about a reference by key.')
        .response(
            'ok',
            ReferenceSchema.required(),
            ['application/json'],
            'The updated reference.',
        );

    // TODO: Test this
    // TODO: Error handling
    router
        .delete(':_key', (req, res) => {
            let user: User | null = null;
            if (req.session && req.session.data)
                user = new User(req.session.data);
            ReferenceService.deleteReference(user, req.pathParams._key);
        })
        .summary('Remove a reference.')
        .description('Removes information about a reference by key.')
        .response(
            'no content',
            'No data is returned by calls to this endpoint.',
        );

    // TODO: Test this
    // TODO: Error handling
    router
        .get('csv', (req, res) => {
            let user: User | null = null;
            if (req.session && req.session.data)
                user = new User(req.session.data);
            res.send(ReferenceService.toCsv(user));
        })
        .summary('Get references in CSV format.')
        .description(
            'Returns all references the user has access to in CSV format.',
        )
        .response('ok', ['text/csv'], 'The references in CSV format.');

    // TODO: Test this
    // TODO: Error handling
    router
        .put('csv', (req, res) => {
            let user: User | null = null;
            if (req.session && req.session.data)
                user = new User(req.session.data);
            res.send(ReferenceService.fromCsv(user, req.body.toString()));
        })
        .body(['text/csv'], 'The reference data to upload in CSV format.')
        .summary('Upload reference information in CSV format.')
        .description(
            dd`
            Upload references information in CSV format.
            References will be updated when a matching key is found and created otherwise.
            `,
        )
        .response(
            'ok',
            Joi.object({
                data: Joi.array().items(ReferenceSchema).required(),
            }).required(),
            ['application/json'],
            'The uploaded references information in JSON format.',
        );

    return router;
};