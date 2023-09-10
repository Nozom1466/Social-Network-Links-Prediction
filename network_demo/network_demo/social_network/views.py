import json
import os
import networkx as nx
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.contrib.staticfiles import finders


def index(request):
    return render(request, 'social_network.html')


def nx_algos(request):
    algo_dict = {
        "3": "Adamic-Adar-index",
        "4": "Common_Neighbor_Centrality"
    }

    # load json
    data = json.loads(request.body)

    # get info
    algo_type = data["info"]["algo"]
    focused = data["info"]["focused_id"]
    target = data["info"]["target_id"]

    # build the nx graph
    G = nx.node_link_graph(
        data=data,
        directed=False,
        multigraph=False,
        source='source',
        target='target',
        name='id',
        link='links'
    )

    results = {}

    # calc
    preds = []
    if algo_dict[algo_type] == "Adamic-Adar-index":
        preds = nx.adamic_adar_index(G)
    elif algo_dict[algo_type] == "Common_Neighbor_Centrality":
        preds = nx.common_neighbor_centrality(G)

    # filter results
    if target == "-1":
        for u, v, p in preds:
            if (u == focused or v == focused) and p > 0:
                results[u if (v == focused) else v] = p
    else:
        for u, v, p in preds:
            if u == focused and v == target or u == target and v == focused:
                results[u if (v == focused) else v] = p
                break

    return JsonResponse(results)


def save_file(request):
    if request.method == 'POST':
        uploaded_file = request.body
        save_path = finders.find('json/')
        file_name = f"user_loaded.json"
        file_path = os.path.join(save_path, file_name)

        with open(file_path, 'wb') as destination_file:
            destination_file.write(uploaded_file)

        return JsonResponse({"ok": 200, "filename": file_name})
    else:
        return JsonResponse({"failed": 500, "filename": None})
