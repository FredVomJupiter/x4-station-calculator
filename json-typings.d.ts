// This file is needed to allow TypeScript to import JSON files.

declare module "*.json" {
    const value: any;
    export default value;
}