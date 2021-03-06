interface Window {
    authVK: any;
    userInfo: object;
}

declare var React: any;

declare module "redux-sync-promise" {
    export var APISync: any;
}

// declare function require(path: string): void;

declare function connect(mapStateToProps: any, mapDispatchToProps: any): void;

declare interface ObjectConstructor {
    assign(...objects: Object[]): Object;
}

declare type RechartsFunction = () => object;



