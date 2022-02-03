import future.keywords.in

package policy.change

default allow = false
allow {
	some repoTag in input.stackMetadata
	repoTag.type == "repoTag"
	repoTag.data != ""

	some errorBudget in input.stackMetadata
	errorBudget.type == "errorBudget"
	errorBudget.data > 10
}
