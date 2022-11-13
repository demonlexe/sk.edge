from fix_ratemyprofessor import get_professor_by_school_and_name, get_school_by_name, Professor
from flask import jsonify

def get_professor_ctrl(school_name: str, prof_name: str):
    school = get_school_by_name(school_name)
    if school_name is None or prof_name is None:
        return "Professor/school not provided!", 404
    if school is None:
        print("School", school_name, "not found!")
        return "School not found!", 404
    prof: Professor = get_professor_by_school_and_name(school, prof_name)
    if prof is None:
        print("Prof", prof_name, "not found!")
        return "Professor not found!", 404
    return prof.__serialize__() 

def get_professors_ctrl(school_name: str, prof_names):
    school = get_school_by_name(school_name)
    if school_name is None or prof_names is None:
        return "Professor/school not provided!", 404
    if school is None:
        print("School", school_name, "not found!")
        return "School not found!", 404
    prof_list = []
    for x in prof_names:
        prof: Professor = get_professor_by_school_and_name(school, x)
        if prof is None:
            print("Prof", x, "not found!")
        prof_list.append(prof.__serialize__())
    return jsonify(prof_list)