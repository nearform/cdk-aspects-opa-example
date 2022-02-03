package policy.change

import future.keywords.in

default allow = false
allow {
	some repoTag in input.stackMetadata
	repoTag.type == "repoTag"
	repoTag.data != ""

	some errorBudget in input.stackMetadata
	errorBudget.type == "errorBudget"
	errorBudget.data > 0
}
