import {
    GraphQLNonNull,
    GraphQLList,
    GraphQLString
} from 'graphql'

import {
    connectionArgs,
    mutationWithClientMutationId,
    cursorForObjectInConnection,
    connectionFromPromisedArray,
    fromGlobalId
} from 'graphql-relay'

import Database from '../database'

import {
    GraphQLViewer,
    GraphQLModelEdge,
    GraphQLItemEdge,
    GraphQLCommentType,
    GraphQLItemType
} from '../graphql/Model'

import {
    getViewer,
} from '../stores/UserStore';


export const AddModelMutation = new mutationWithClientMutationId({
    name: 'AddModel',
    description: 'Function to create model',
    inputFields: {
        brandName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    outputFields: {
        viewer: {
            type: GraphQLViewer,
            resolve: () => getViewer
        },
        modelEdge: {
            type: GraphQLModelEdge,
            resolve: (obj, {id}) => {
                
                return Database.models.model.findAll()
                    .then(dataModels => {

                        let itemToPass
                        for (const model of dataModels) {
                            if (model.id === obj.id) {
                                itemToPass = model;
                            }
                        }
                        var cursor = cursorForObjectInConnection(dataModels, itemToPass);
                        return {
                            cursor: cursor,
                            node: itemToPass
                        }
                    })
            }
        }
    },
    mutateAndGetPayload: ({brandName, name}) => {

        return Database.models.brand.findOrCreate({where: {name: brandName}})
            .spread((brand, wasCreated) => { // spread is necessary when multiple return value

                return Database.models.model.create({name: name, brandId: brand.id})
                    .then((model) => {
                        return {
                            model: {
                                name: model.name,
                                brand: {name: brand.name}
                            },
                            id: model.id

                        }
                    })

            })
    }
})

export const AddItemMutation = mutationWithClientMutationId({
    name: 'AddItem',
    description: 'A function to create an item',
    inputFields: {
        modelName: {type: new GraphQLNonNull(GraphQLString)},
        severity: {type: new GraphQLNonNull(GraphQLString)},
        domains: {type: new GraphQLList(GraphQLString)},
        subCategories: {type: new GraphQLList(GraphQLString)},
        comments: {type: new GraphQLList(GraphQLString)},
        author: {type: GraphQLString}
    },
    outputFields: {
        viewer: {
            type: GraphQLViewer,
            resolve: () => getViewer
        },
        itemEdge: {
            type: GraphQLItemEdge,
            resolve: (obj) => {

                return Database.models.item.findAll()
                    .then(items => {

                        let itemToPass
                        for (const item of items) {
                            if (item.id === obj.id) {
                                itemToPass = item;
                            }
                        }
                        var cursor = cursorForObjectInConnection(items, itemToPass);
                        return {
                            cursor: cursor,
                            node: itemToPass
                        }
                    })
            }
        }
    },
    mutateAndGetPayload: ({modelName, severity, domains, subCategories, comments, author}) => {

        return Database.models.model.findOne({where: {name: modelName}})
            .then(model => {

                domains.forEach(domain => {
                    Database.models.domain.findOrCreate({where: {name: domain}})
                        .then(domain => model.addDomain(domain[0]))
                })

                subCategories.forEach(subCategory => {
                    Database.models.subCategory.findOne({where: {name: subCategory}})
                        .then(retrievedSubCategory => model.addSubCategory(retrievedSubCategory))
                })

                return Database.models.brand.findById(model.brandId)
                    .then(brand => {

                        var brandName = brand.name.replace(/ /g,'').substring(0, 4);
                        var modelName = model.name.replace(/ /g,'').substring(0, 4);
                        var reference = brandName.toUpperCase() + modelName.toUpperCase()

                        return Database.models.item.count({where: {reference: {$like: reference + '%'}}})
                            .then(id => {
                                var nextId = id + 1
                                reference = reference  + "-" + nextId
                                return Database.models.state.findOne({where: {severity: severity}})
                                    .then(state => {
                                        return model.createItem({ stateId: state.id, reference: reference})
                                            .then(item =>  {
                                                comments.forEach(c => item.createComment({text: c, author: author}))
                                                return item
                                            })
                                    })
                            })
                    })



            })
    }
});

export const AddItemCommentMutation = new mutationWithClientMutationId({
    name: 'AddItemComment',
    description: 'Function to add a comment to an item',
    inputFields: {
        text: {type: new GraphQLNonNull(GraphQLString)},
        author: {type: new GraphQLNonNull(GraphQLString)},
        itemId: {type: new GraphQLNonNull(GraphQLString)}
    },
    outputFields: {
        item: {
            type: GraphQLItemType,
            resolve: (obj) => obj.item
        }
    },
    mutateAndGetPayload: ({text, author, itemId}) => {


        return Database.models.item.findOne({where: {id: fromGlobalId(itemId).id}})
            .then(item => {
                return item.createComment({text: text, author: author})
                    .then(c => {
                        return {
                            item: item,
                            comment: c
                        }
                    })


            })
    }
});

