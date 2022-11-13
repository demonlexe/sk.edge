import functions_framework

from controller import get_professor_ctrl, get_professors_ctrl

# @functions_framework.http
# def get_professor(request):
#    # request_json = request.get_json(silent=True)
#    response = get_professor_ctrl(request.get_json()["school"], request.get_json()["name"])

#    return response

@functions_framework.http
def get_professors(request):

   ## Set CORS headers for the preflight request
   if request.method == 'OPTIONS':
      ## Allows GET requests from any origin with the Content-Type
      headers = {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Methods': 'POST',
         'Access-Control-Allow-Headers': 'Content-Type',
         'Access-Control-Max-Age': '3600'
      }

      return ('', 204, headers)

   # request_json = request.get_json(silent=True)
   print(request.get_json()["school"])
   print(request.get_json()["names"])
   response = get_professors_ctrl(request.get_json()["school"], request.get_json()["names"])

   ## Set CORS headers for the main request
   headers = {
      'Access-Control-Allow-Origin': '*'
   }
   
   return (response, 200, headers)
