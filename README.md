# readme-tree-writer
GitHub Action to write the output of "tree" command to each README in your project.


## Usage
Apply to `uses` in workflow config like below.

```yaml
- uses: shirakiya/readme-tree-writer@v1
```

### Example workflow

This action is helpful to check for maintenance that there are any diff between written tree content in README and actual.
Following workflow is an example to check the diff and fail workflow if the diff is exist.


```yaml
name: Check tree diff

on: push

jobs:
  sample-workflow:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Write tree outputs to README.md
        uses: shirakiya/readme-tree-writer@v1
        with:
          config_path: .github/readmetreerc.yml
      - name: Check diff
        run: |
          if [ "$(git diff --ignore-space-at-eol . | wc -l)" -gt "0" ]; then
            echo "Detected diff.  See status below:"
            git --no-pager diff HEAD .
            git status
            exit 1
          fi
```

### Action Inputs

| input       | description                                                                          |
|-------------|--------------------------------------------------------------------------------------|
| config_path | The path of configuration file for this action (default: `.github/readmetreerc.yml`) |

### Action Outputs

This action does not have any outputs.

### Configuration

This action can be configured by YAML formatted file. It refers to `.github/readmetreerc.yml` in defualt, but you can specify with input parameters `config_path`.  
The parameters that can be set are listed below.

| parameter   | description                                                                                                                                           |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| `fileNames` | The list of file names that are scanned. (default: `README.md`)                                                                                       |
| `chapter`   | The chapter name where this action writes tree output. Lines that starts with `#` are regarded (In other words `#`, `##`, `###` and so are included). |
| `include`   | The list of directories that are scanned whether files named `fileNames` param are exist. (default: `.`)                                              |
| `exclude`   | The list of directories that are not scanned. (no default)                                                                                            |

Here is an example.

```yaml
fileNames:
  - README.md
  - README_dev.md
chapter: Tree
include:
  - "."
exclude:
  - node_modules
```


## Details

### Feature

This action writes the results of the `tree` command **in each directory where the README exists** to each README.  
  
For example, when the directory structure is as follows, the following is written in each README.

```
.
├── dir1
│   ├── README.md
│   ├── dir1
│   │   └── file
│   └── dir2
│       └── file
└── dir2
    ├── README.md
    └── file
```

- `./dir1/README.md`

````
# Tree

```
.
├── README.md
├── dir1
│   └── file
└── dir2
    └── file

```

````

- `./dir2/README.md`

````
# Tree

```
.
├── README.md
└── file
```

````


### tree and its outputs

This action uses following command and options in each directory to get tree output.

```
tree --noreport .
```

And writes the output to README file. You should pay attension to new lines.

````
# Chapter

```
.
├── dir1
│   ├── file
│   └── dir1-1
│       └── file
└── dir2
    └── file

```

````


## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)
