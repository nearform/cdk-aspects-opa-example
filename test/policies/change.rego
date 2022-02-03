package policy.change

import future.keywords.in

default allow = false
allow {
	# some errorBudget in input.metadata # iterate over values
	# errorBudget.type == "errorBudget"
	# errorBudget.data > 99
	some repoTag in input.stackMetadata
	repoTag.type == "repoTag"
	repoTag.data != ""	
}

# #This will return {"result": {"allow": false}}
# prj {
#     "input":{
#         "id":"MyTestStack",
#         "addr":"c814b2c5dc22d11a84e78a63be7bb7815715b70534",
#         "path":"MyTestStack",
#         "metadata":[
#             {
#                 "type":"errorBudget","data":0
#             }
#         ],
#         "tags":{
#             "active": "yes",
#             "hasBudget": "yes"
#         }
#     }
# }

# # This will return {"result": {"allow": true}}
# prj2{
#     "input":{
#         "id":"MyTestStack",
#         "addr":"c814b2c5dc22d11a84e78a63be7bb7815715b70534",
#         "path":"MyTestStack",
#         "metadata":[
#             {
#                 "type":"repoTag","data":"test-opa-change"
#             },
#             {
#                 "type":"errorBudget","data":100
#             }
#         ],
#         "tags":{
#             "active": "yes",
#             "hasBudget": "yes"
#         }
#     }
# }

