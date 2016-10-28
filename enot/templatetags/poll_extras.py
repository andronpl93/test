from django import template

register = template.Library()

def plur(numb):
    res=' комментари'
    if (numb>=5 and numb<=20) or (numb%10>=5 and numb%10<=9) or numb%10==0:
        res=str(numb)+res+'ев'
    elif numb%10==1:
        res=str(numb)+res+'й'
    elif numb%10>=2 and numb%10<=4:
        res=str(numb)+res+'я'
    return res


register.filter('plur', plur)