import {FallBackProps} from "./ErrorBoundary.tsx";
import {Heading1} from "../heading/Heading1.tsx";
import {Heading2} from "../heading/Heading2.tsx";
import {Errory} from "./Errory.ts";

/**
 * A default fallback component
 * @param error
 * @constructor
 */

export function ErrorFallback({error}: FallBackProps) {

    const errory = new Errory(error);
    return (
        <div>
            <Heading1 className={'text-danger'}>Error</Heading1>
            <p>Sorry, an unexpected fatal error has occurred.</p>
            <Heading2>Message</Heading2>
            <div className={'border rounded p-3 mb-3'}>
                {errory.getMessage()}
            </div>
            {import.meta.env.DEV &&
                (
                    <div className={'mt-5'}>
                        <Heading2>Dev Technical information</Heading2>
                        <p><b>Stack Trace</b></p>
                        <div className={'border rounded p-3 mb-3'}>
                            {errory.getStackTrace()}
                        </div>
                        <p><b>Error Object as Json:</b></p>
                        <div className={'border rounded p-3 mb-3'}>
                            {errory.getAsJson()}
                        </div>
                    </div>
                )}
        </div>
    )
}
