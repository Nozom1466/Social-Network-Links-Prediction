# Social-Network-Links-Prediction
Tongji Data Structure Project - Social Network Links Prediction


[video](https://www.bilibili.com/video/BV1mP41187tY/?spm_id_from=333.999.0.0&vd_source=d0416378a50b5f05a80e1ed2ccc0792f)

## Disclaimer
- Name generator: [Name generator](https://www.namechef.co/zh/name-generator/japanese/?gender=any&last_name_type=random&last_name=&popularity%5B%5D=any)
- organizations (schools)
    - [high school](https://ja.wikipedia.org/wiki/%E4%BA%AC%E9%83%BD%E5%BA%9C%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E4%B8%80%E8%A6%A7)
    - [junior school](https://ja.wikipedia.org/wiki/%E4%BA%AC%E9%83%BD%E5%BA%9C%E4%B8%AD%E5%AD%A6%E6%A0%A1%E4%B8%80%E8%A6%A7)
    - [primary school](https://ja.wikipedia.org/wiki/%E4%BA%AC%E9%83%BD%E5%BA%9C%E5%B0%8F%E5%AD%A6%E6%A0%A1%E4%B8%80%E8%A6%A7)

## Languages & Packages & Frameworks
- `javascript`, `python`(+ `jupyter notebook`)
- `echarts`, `bootstrap`, `ajax`, `networkx`
- `Django`

## Environment Setup

create virtual environment in `conda` (env name: social_network)
```cmd
cd network_demo
conda env create -f environment.yaml
conda activate social_network
```


## Quick Start
An overview
![Overview](/pages/overview.png)


enter the folder with `manage.py` then start service
```cmd
cd network_demo
python manage.py runserver
```
![Initial view](/pages/initial.png)


scale background graph by scrolling
click on categories at the top of the page
![Scaling & category shifting](/pages/scale.png)
> features implemented in echarts


click on cards in the left sidebar, profile displayed on the right sidebar
![detailed info](/pages/details.png)


select Algorithms (default to `Intersection`) and Mode (default to `All Users`) at the bottom of Detailed infomation
![select](/pages/algorithms.png)


`All user` mode
![All User mode](/pages/all_users.png)


`target user` mode
![target mode](/pages/target_user.png)


wrong input get warnings
![warnings](/pages/warnings.png)


manage your page with control island (UDCP Buttons)
![manage your page](/pages/page_management.png)


upload your `JSON` file at `Custom`
![Upload your file](/pages/upload.png)

new graph loaded
![new graph](/pages/new_graph.png)


return to Defalut graph at `Default`
![default](/pages/default.png)


## Generate Dataset
data generator in folder `data\eupho_dataset\dataset_generator.ipynb`

> As for the name `eupho`, I initially wanted to build up a network with the purpose of displaying *sophisticated* interpersonal relationships in Animation Series `Sound! Euphonium`. And that's exactly the reason why I tested *Japanese names* in my demo dataset. The organizations in this network could be schools, clubs, companies or even social groups and person nodes are individuals (characters in the anime :) )


>  Documenting the profiles of characters in `Sound! Euphonium` is really time-consuming which is not feasible, and actually unnecessary, for a 2-week project. Therefore, I got some random names from name generators on Google. (But I got names of `Kituji High School Concert Band` from Season 1 to Season 2.5 which are listed in the file `data\eupho_dataset\dataset_generator.ipynb`)


## Prediction Algorithms
$C(u, v)$ denotes the prediction score between individual $u$ and $v$.

### (Weighted) Intersection


$C(u, v) = \sum_{k \in \text{categories}} w_{u, k} \cdot N_{u, v, k}$

### Intersection over Union


$C(u, v) = \frac{|\Gamma(u) \cap \Gamma(v)|}{|\Gamma(u) \cup \Gamma(v)|}$


where $\Gamma(u)$ denotes the set of neighbors of $u$, $\Gamma(v)$ denotes the set of neighbors of $v$
> Bonus: individual social habits considered. A wide range of friends means less strengthed friendship while deeper friendship expected for individuals who have fewer connections with others. The node would earn higher score if it had a few connections but still shared many nodes with the target.


### Adamic-Adar Index
[Official Networkx Implementation](https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.link_prediction.adamic_adar_index.html)


$C(u, v) = \sum_{w \in \Gamma(u) \cap \Gamma(v)} \frac{1}{\log |\Gamma(w)|}$


where $\Gamma(u)$ denotes the set of neighbors of $u$. This index leads to zero-division for nodes only connected via self-loops. It is intended to be used when no self-loops are present.
.

### Common Neighbor Centrality (CCPA Score)
[Official Networkx Implementation](https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.link_prediction.common_neighbor_centrality.html)


$C(u, v) = \alpha \cdot (|\Gamma (u){\cap }^{}\Gamma (v)|)+(1-\alpha )\cdot \frac{N}{{d}_{uv}}, \quad \alpha \in \[0, 1\]$


where $\Gamma(u)$ denotes the set of neighbors of $u$, $\Gamma(v)$ denotes the set of neighbors of $v$, $\alpha$ is parameter varies between $\[0, 1\]$ and  default to `0.8`, $N$ denotes total number of nodes in the Graph and $d_{u, v}$ denotes shortest distance between $u$ and $v$ .








