package policy.financial

default allow = false
allow {
	input.tags.active == "yes"
	input.tags.hasBudget == "yes"
}

# #This will return {"result": {"allow": false}}
# prj {
#     "input": {
#         "projectId": "my-project",
#         "active": "false"
#     }
# }

# # This will return {"result": {"allow": true}}
# prj2 {
#     "input": {
#         "projectId": "my-project",
#         "active": "yes",
#         "hasBudget": "yes"
#     }
# }

