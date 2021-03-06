import GremlinDriver from 'gremlin';
import Parser from './Parser';

/**
 * This is a client class that connects to gremlin-server directly
 *
 * @author Dylan Millikin <dylan.millikin@gmail.com>
 * @link https://github.com/jbmusso/gremlin-javascript
 */
class DriverClient {
    /**
     * @type {GremlinClient} see jbmusso/gremlin-javascript
     */
    _client;

    /**
     * @type {Parser} a Parser object used to parse the data
     */
    parser;

    /**
     * Create the client
     *
     * @param  {String}  host    the host name / ip
     * @param  {Integer} port    the port number for the client to connect to
     * @param  {Object}  options the driver options as per defined in the driver documentation
     * @return void
     */
    constructor(host, port, options, parser) {
        if(typeof parser === "undefined") {
            this.parser = new Parser();
        } else {
            this.parser = parser;
        }
        this._client = GremlinDriver.createClient(port, host, options);
    }

    /**
     * Run a query with various params.
     * Bellow are the three expected params. optionals can be ommitted and interchanged
     *
     * @param  {String}   query    mandatory: the gremlin query to run
     * @param  {Object}   bindings optional: the bindings associated to this query
     * @param  {Function} callback optional: function that executes once the results are received.
     * @return {Void}
     */
    execute(query, bindings, callback) {
        if(typeof bindings === 'function') {
            callback = bindings;
            bindings = {};
        }

        //customize the callback params to use Parser
        const customCallback = (err, results) => {
            callback(this.parser.create(err, results));
        };
        this._client.execute(query, bindings, customCallback);
    }

    /**
     * Register a callback on error
     * It's rare to need this but sometimes you'll want to register a sepcific behavior against the client's error management
     *
     * @param  {Function} callback the method to run on client error.
     * @return {Void}
     */
    onError(callback) {
        this._client.on('error', callback);
    }

    /**
     * Register a callback on Open
     *
     * @param  {Function} callback the method to run on client error.
     * @return {Void}
     */
    onOpen(callback) {
        this._client.on('open', callback);
    }
}

export default DriverClient;
