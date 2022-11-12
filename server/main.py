import fix_ratemyprofessor

if __name__ == "__main__":
    school = fix_ratemyprofessor.get_school_by_name("the University of Texas at Dallas")
    prof = fix_ratemyprofessor.get_professor_by_school_and_name(school, "Omar Hamdy")
    print(prof.rating)