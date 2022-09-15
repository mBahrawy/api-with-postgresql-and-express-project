import { DisplayProcessor, StacktraceOption } from "jasmine-spec-reporter";
import { SpecReporter } from "jasmine-spec-reporter";
import { Service } from "typedi";
import SuiteInfo = jasmine.SuiteInfo;

@Service()
export class CustomProcessor extends DisplayProcessor {
    public displayJasmineStarted(info: SuiteInfo, log: string): string {
        return `TypeScript ${log}`;
    }
}
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
    new SpecReporter({
        spec: {
            displayStacktrace: StacktraceOption.NONE
        },
        customProcessors: [CustomProcessor]
    })
);
