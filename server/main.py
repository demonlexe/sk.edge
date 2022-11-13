import functions_framework

from controller import get_professor_ctrl

@functions_framework.http
def get_professor(request):
   # request_json = request.get_json(silent=True)
   response = get_professor_ctrl(request.get_json()["school"], request.get_json()["name"])

   return response
