def get_answer(text, answer_dict, html_dict):
    # 입력받은 텍스트에서 공백과 '-'을 제거한 텍스트
    re_text = text.replace(" ", "").replace("-", "")
    # 대문자로 변환하여 일관된 비교를 위한 텍스트
    trim_text = re_text.upper()
    # 관련된 답변을 저장할 리스트
    related_answers = []

    # 입력이 공백이거나 None인 경우
    if not trim_text:
        return "질문을 입력해주세요."

    # 입력한 텍스트가 딕셔너리의 키에 있는 경우
    if trim_text in answer_dict:
        answer = answer_dict[trim_text]

        answer_with_line_breaks = answer.replace('\n', '<br>')
        # 해당 답변이 텍스트 형식인 경우
        if html_dict[answer] == 'txt':
            return answer_with_line_breaks
        # 답변이 URL인 경우 링크와 함께 반환
        else:
            if html_dict[answer] == 'web':
                return f"[ {trim_text} ] 에 대한 답변입니다.<br><a href =\"{answer}\"  class=\"myButton1\" target=\"_blank\">{ trim_text }</a>"
            elif html_dict[answer] == 'service':
                return f"[ {trim_text} ] 에 대한 답변입니다.<br><a href =\"{answer}\" class=\"myButton2\" target=\"_blank\">{trim_text}</a>"
            else:
                return f"[ {trim_text} ] 에 대한 답변입니다.<br><a href =\"{answer}\" class=\"myButton3\" target=\"_blank\">{trim_text}</a>"
            #return <iframe src="https://www.google.com/" width="100" height="100"></iframe>

    # 관련된 답변을 찾아 리스트에 추가
    for key in answer_dict:
        if trim_text in key:
            related_answers.append(key)

    # 관련된 답변이 있는 경우
    if related_answers:
        response = f"[ {trim_text} ] 에 대한 답변입니다.<br>"
        #response = f"관련 단어 [ {' | '.join(related_answers)} ] 에 대한 답변 입니다.<br>"
        for related_answer in related_answers:
            answer = answer_dict[related_answer]
            # 답변이 텍스트 형식인 경우 텍스트를 추가
            if html_dict[answer] == 'txt':
                response += f"{answer}<br>"
            # 답변이 URL인 경우 링크와 함께 추가
            else:
                if html_dict[answer] == 'web':
                    response += f"<a href=\"{answer}\" class=\"myButton1\" target=\"_blank\">{ related_answer }</a> <br>"
                elif html_dict[answer] == 'service':
                    response += f"<a href=\"{answer}\" class=\"myButton2\" target=\"_blank\">{related_answer}</a> <br>"
                else:
                    response += f"<a href=\"{answer}\" class=\"myButton3\" target=\"_blank\">{related_answer}</a> <br>"
        return response

    #http://clm.lge.com/issue/browse/SDTPLTFRM-25855?filter=71073&jql=status%20%3D%20resolved%20AND%20assignee%20in%20(dongha.hwang)

    else:
        #response = f"[ {trim_text} ] 에 대한 답변 결과를 찾을 수 없습니다."
        response = f"[ {trim_text} ] 에 대한 답변 결과를 찾을 수 없습니다.<br><a href=\"https://www.naver.com\" class=\"myButton3\" target=\"_blank\"> naver 에서 검색</a>"
        return response


    return "안녕하세요!<br> 질문을 입력해주세요."
