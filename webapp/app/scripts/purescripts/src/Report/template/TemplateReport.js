"use strict";exports.template="<div class=\"container-fluid routed\" id='report'>\n  <div class='col-xs-12'>\n    <h3>\n      {{{project.title}}}\n    </h3>\n    <button class=\"pull-right btn btn-default btn-pad\"\n        onClick=\"Actions.Report.resetAll()\">Reset</button>\n    <button class=\"pull-right btn btn-default btn-pad\"\n        onClick=\"Actions.Report.download()\">Download Report</button>\n      <table class=\"table report-table\">\n        <thead class=\"thead-inverse\">\n          <tr>\n            <th>Comparison</th>\n            <th>Number of Studies</th>\n            <th>\n              Within-study bias\n            </th>\n            <th>\n              Reporting bias\n            </th>\n            <th>\n              Indirectness\n            </th>\n            <th>\n              Imprecision\n            </th>\n            <th>\n              Heterogeneity\n            </th>\n            <th>\n              Incoherence\n            </th>\n            <th>\n              Confidence rating\n            </th>\n          </tr>\n        </thead>\n        <tbody>\n          {{#if hasDirects}}\n            <tr>\n              <td colspan='9'>\n            <h4>Mixed evidence</h4>\n            </tr>\n            {{#each directRows}}\n              <tr>\n                <th scope=\"row\">\n                  {{{armA}}} vs {{{armB}}}\n                </th>\n                <td>\n                  {{numberOfStudies}}\n                </td>\n                <td style=\"background-color:{{studyLimitation.color}}\" {{# if studyLimitation.customized}} class='customized-report'{{/if}}>\n                  {{studyLimitation.label}}\n                </td>\n                <td style=\"background-color:{{pubbias.color}}\"  {{# if pubbias.customized}} class='customized-report'{{/if}}>\n                  {{pubbias.label}}\n                </td>\n                <td style=\"background-color:{{indirectness.color}}\"  {{# if indirectness.customized}} class='customized-report'{{/if}}>\n                  {{indirectness.label}}\n                </td>\n                <td style=\"background-color:{{imprecision.color}}\"  {{# if\n                  imprecision.customized}} class='customized-report'{{/if}}>\n                  {{imprecision.label}}\n                </td>\n                <td style=\"background-color:{{heterogeneity.color}}\"  {{# if heterogeneity.customized}} class='customized-report'{{/if}}>\n                  {{heterogeneity.label}}\n                </td>\n                <td style=\"background-color:{{incoherence.color}}\"  {{# if incoherence.customized}} class='customized-report'{{/if}}>\n                  {{incoherence.label}}\n                </td>\n                <td>\n                  <select onChange=\"Actions.Report.updateReportJudgement(this)()\"\n                          style=\"border: solid {{judgement.selected.color}};\n                                 border-radius: 5px;\n                                 background: white;\"> \n                    {{#each judgement.levels}} \n                    <option style=\"background:{{color}}\" value=\"{{id}}σδεl{{../id}}\" \n                              {{#if selected }} selected=\"selected\"\n                              {{/if}}>\n                    {{label}}\n                      </option>\n                    {{/each}}\n                  </select>\n                </td>\n              </tr>\n            {{/each}}\n          {{/if}}\n          {{#if hasIndirects}}\n            <tr>\n              <td colspan='9'>\n            <h4>Indirect evidence</h4>\n            </tr>\n            {{#each indirectRows}}\n              <tr>\n                <th scope=\"row\">\n                  {{{armA}}} vs {{{armB}}}\n                </th>\n                <td>\n                  --\n                </td>\n                <td style=\"background-color:{{studyLimitation.color}}\" {{# if studyLimitation.customized}} class='customized-report'{{/if}}>\n                  {{studyLimitation.label}}\n                </td>\n                <td style=\"background-color:{{pubbias.color}}\"  {{# if pubbias.customized}} class='customized-report'{{/if}}>\n                  {{pubbias.label}}\n                </td>\n                <td style=\"background-color:{{indirectness.color}}\"  {{# if indirectness.customized}} class='customized-report'{{/if}}>\n                  {{indirectness.label}}\n                </td>\n                <td style=\"background-color:{{imprecision.color}}\"  {{# if\n                  imprecision.customized}} class='customized-report'{{/if}}>\n                  {{imprecision.label}}\n                </td>\n                <td style=\"background-color:{{heterogeneity.color}}\"  {{# if heterogeneity.customized}} class='customized-report'{{/if}}>\n                  {{heterogeneity.label}}\n                </td>\n                <td style=\"background-color:{{incoherence.color}}\"  {{# if incoherence.customized}} class='customized-report'{{/if}}>\n                  {{incoherence.label}}\n                </td>\n                <td>\n                  <select onChange=\"Actions.Report.updateReportJudgement(this)()\"\n                          style=\"border: solid {{judgement.selected.color}};\n                                 border-radius: 5px;\n                                 background: white;\"> \n                    {{#each judgement.levels}} \n                    <option style=\"background:{{color}}\" value=\"{{id}}σδεl{{../id}}\" \n                              {{#if selected }} selected=\"selected\"\n                              {{/if}}>\n                        {{label}}\n                      </option>\n                    {{/each}}\n                  </select>\n                </td>\n              </tr>\n            {{/each}}\n          {{/if}}\n        </tbody>\n      </table>\n      <br>\n      <br>\n  </div>\n</div>\n"