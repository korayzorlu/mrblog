from django.shortcuts import redirect, render, HttpResponse
from django.contrib.auth import login, authenticate

from .models import Article

# Create your views here.

def index(request):
    user = authenticate(username = "admin", password = "administration")
    login(request, user)

    articles = Article.objects.filter(user = request.user)

    i = 0

    if request.method == "POST":
        title = request.POST.get("title")

        article = Article()
        article.user = request.user
        article.title = title
        article.save()

        return redirect("index")

    context = {
                "articles" : articles,
                "i" : i
            }

    return render(request, "index.html", context)