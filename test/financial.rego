package policy.financial

default allow = false
allow {
	input.hasBudget == true
	input.genre == "Female"
	input.name == "Aline"
}
