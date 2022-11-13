import functions_framework

from controller import get_professor_ctrl, get_professors_ctrl

@functions_framework.http
def get_professor(request):
   # request_json = request.get_json(silent=True)
   response = get_professor_ctrl(request.get_json()["school"], request.get_json()["name"])

   return response

@functions_framework.http
def get_professors(request):
   # request_json = request.get_json(silent=True)
   response = get_professors_ctrl(request.get_json()["school"], request.get_json()["name"])

   return response
