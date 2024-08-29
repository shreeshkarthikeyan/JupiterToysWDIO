import * as dotenv from 'dotenv';
import * as path from 'path';

class ReadProperties {

    public readEnvironmentVariables() {

        const __dirname = path.resolve();
        dotenv.config({
            path : `${__dirname}/test/.env`
        });
        
        const baseUrl = process.env.baseurl === undefined ? this.handleError("baseurl") : process.env.baseurl;
        const customerbaseurl = process.env.customerbaseurl === undefined ? this.handleError("customerbaseurl") : process.env.customerbaseurl;
        const client_id = process.env.client_id === undefined ? this.handleError("client_id") : process.env.client_id;
        const client_secret = process.env.client_secret === undefined ? this.handleError("client_secret") : process.env.client_secret;
        const scope = process.env.scope === undefined ? this.handleError("scope") : process.env.scope;
        const grant_type = process.env.grant_type === undefined ? this.handleError("grant_type") : process.env.grant_type;
        const tokenurl = process.env.tokenurl === undefined ? this.handleError("tokenurl") : process.env.tokenurl;

        return {
            baseUrl, customerbaseurl, client_id, client_secret, scope, grant_type, tokenurl
        };
    }

    public handleError(envVariable : string) : void {
        throw new Error(`No such '${envVariable}' variable present in the env file`);
    }
}

export default new ReadProperties();