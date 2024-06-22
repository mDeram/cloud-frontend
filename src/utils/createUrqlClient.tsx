import { ClientOptions, fetchExchange, mapExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import schema, { ConfirmRegisterMutation, ConfirmResetPasswordMutation, DeleteUserMutation, LoginMutation, SearchDocument, SearchQuery, UserDocument, UserQuery } from "../generated/graphql";
import { devtoolsExchange } from "@urql/devtools";
import { ___prod___ } from "../constants";
import pathLib from "path";
import Router from "next/router";
import SimpleNotification from "../components/SimpleNotification";
import { Ctx } from "../pages/_app";

const createUrqlClient = (ctx: Ctx) => {
    const config: ClientOptions = {
        url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "",
        fetchOptions: {
            credentials: "include",
            headers: { "Apollo-Require-Preflight": "true" }
        },
        exchanges: [
            cacheExchange({
                schema,
                updates: {
                    Mutation: {
                        rm: (result, args, cache, _info) => {
                            (result.rm as boolean[]).forEach((value, index) => {
                                if (!value) return;

                                const path = pathLib.dirname((args.paths as string[])[index]);
                                cache.invalidate("Query", "ls", { path });
                            });
                            cache.invalidate("Query", "lsTrash");
                            cache.invalidate("Query", "diskUsage");
                        },
                        trash: (result, args, cache, _info) => {
                            //OPTI very optimizable code
                            const searchQueries = cache.inspectFields("Query").filter(query => query.fieldName === "search");

                            (result.trash as boolean[]).forEach((value, index) => {
                                if (!value) return;

                                const path = (args.paths as string[])[index];
                                const dirname = pathLib.dirname(path);
                                cache.invalidate("Query", "ls", { path: dirname });

                                searchQueries.forEach(query => {
                                    cache.updateQuery<SearchQuery>({ query: SearchDocument, variables: query.arguments! }, data => {
                                        if (!data?.search) return null;

                                        const filteredSearch = data.search.filter(item => pathLib.join(item.path, item.name) !== path);
                                        return { search: filteredSearch };
                                    });
                                });
                            });
                            cache.invalidate("Query", "lsTrash");
                        },
                        restore: (result, _args, cache, _info) => {
                            if (!(result.restore as boolean[]).find(item => item === true)) return;

                            cache.invalidate("Query", "ls", { path: "/files" });
                            cache.invalidate("Query", "lsTrash");
                        },
                        mkdir: (result, args, cache, _info) => {
                            if (!result.mkdir || !args) return;

                            const path = pathLib.dirname(args.dirname as string);
                            cache.invalidate("Query", "ls", { path });
                            cache.invalidate("Query", "diskUsage");
                        },
                        logout: (result, _args, cache, _info) => {
                            if (!result.logout) return;

                            cache.updateQuery<UserQuery>({ query: UserDocument }, _data => {
                                return { user: null };
                            });
                        },
                        login: (result, _args, cache, _info) => {
                            cache.updateQuery<UserQuery>({ query: UserDocument }, data => {
                                const typedResult = result as LoginMutation;
                                if (typedResult.login.__typename === "User")
                                    return { user: typedResult.login }
                                return data;
                            });
                        },
                        confirmRegister: (result, _args, cache, _info) => {
                            cache.updateQuery<UserQuery>({ query: UserDocument }, data => {
                                const typedResult = result as ConfirmRegisterMutation;
                                if (typedResult.confirmRegister.__typename === "User")
                                    return { user: typedResult.confirmRegister }
                                return data;
                            });
                        },
                        confirmResetPassword: (result, _args, cache, _info) => {
                            cache.updateQuery<UserQuery>({ query: UserDocument }, data => {
                                const typedResult = result as ConfirmResetPasswordMutation;
                                if (typedResult.confirmResetPassword.__typename === "User")
                                    return { user: typedResult.confirmResetPassword }
                                return data;
                            });
                        },
                        deleteUser: (result, _args, cache, _info) => {
                            const typedResult = result as DeleteUserMutation;
                            if (typedResult.deleteUser?.__typename !== "BooleanResponse"
                             || !typedResult.deleteUser?.response) return;

                            cache.updateQuery<UserQuery>({ query: UserDocument }, _data => {
                                return { user: null };
                            });
                        },
                    }
                }
            }),
            fetchExchange,
            //ssrExchange,
            mapExchange({
                onError(error) {
                    if (error.message.includes("Not authenticated")) {
                        Router.reload();
                        return;
                    }

                    if (!ctx.initialized) return;
                    if (error.networkError) {
                        ctx.pushNotificationDefault!(<SimpleNotification type="error" text="Network Error"/>);
                    } else if (error.graphQLErrors.length) {
                        ctx.pushNotificationDefault!(<SimpleNotification type="error" text="Server Error"/>);
                    }
                }
            })
        ]
    }

    if (!___prod___)
        config.exchanges = [devtoolsExchange, ...config.exchanges!];

    return config;
};

export default createUrqlClient;
