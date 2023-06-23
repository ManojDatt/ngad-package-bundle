/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
/**
 * Intoto for Rekord objects
 */
export type IntotoSchema = IntotoV001Schema | IntotoV002Schema;
/**
 * Schema for intoto object
 */
export interface IntotoV001Schema {
    content: {
        /**
         * envelope
         */
        envelope?: string;
        /**
         * Specifies the hash algorithm and value encompassing the entire signed envelope
         */
        hash?: {
            /**
             * The hashing function used to compute the hash value
             */
            algorithm: "sha256";
            /**
             * The hash value for the archive
             */
            value: string;
        };
        /**
         * Specifies the hash algorithm and value covering the payload within the DSSE envelope
         */
        payloadHash?: {
            /**
             * The hashing function used to compute the hash value
             */
            algorithm: "sha256";
            /**
             * The hash value for the envelope's payload
             */
            value: string;
        };
    };
    /**
     * The public key that can verify the signature
     */
    publicKey: string;
}
/**
 * Schema for intoto object
 */
export interface IntotoV002Schema {
    content: {
        /**
         * dsse envelope
         */
        envelope?: {
            /**
             * payload of the envelope
             */
            payload?: string;
            /**
             * type describing the payload
             */
            payloadType: string;
            /**
             * collection of all signatures of the envelope's payload
             *
             * @minItems 1
             */
            signatures: [
                {
                    /**
                     * optional id of the key used to create the signature
                     */
                    keyid?: string;
                    /**
                     * signature of the payload
                     */
                    sig?: string;
                    /**
                     * public key that corresponds to this signature
                     */
                    publicKey?: string;
                },
                ...{
                    /**
                     * optional id of the key used to create the signature
                     */
                    keyid?: string;
                    /**
                     * signature of the payload
                     */
                    sig?: string;
                    /**
                     * public key that corresponds to this signature
                     */
                    publicKey?: string;
                }[]
            ];
        };
        /**
         * Specifies the hash algorithm and value encompassing the entire signed envelope
         */
        hash?: {
            /**
             * The hashing function used to compute the hash value
             */
            algorithm: "sha256";
            /**
             * The hash value for the archive
             */
            value: string;
        };
        /**
         * Specifies the hash algorithm and value covering the payload within the DSSE envelope
         */
        payloadHash?: {
            /**
             * The hashing function used to compute the hash value
             */
            algorithm: "sha256";
            /**
             * The hash value of the payload
             */
            value: string;
        };
    };
}
