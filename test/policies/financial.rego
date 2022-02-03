package policy.financial

default allow = false
allow {
	input.active == "yes"
	input.hasBudget == "yes"
}
