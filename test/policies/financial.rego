package policy.financial

default allow = false
allow {
	input.tags.active == "yes"
	input.tags.hasBudget == "yes"
}
