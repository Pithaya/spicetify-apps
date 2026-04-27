# API Search guide

## Advanced search
q = Your search query.

You can narrow down your search using field filters. The available filters are `album`, `artist`, `track`, `year`, `upc`, `tag:hipster`, `tag:new`, `isrc`, and `genre`. Each field filter only applies to certain result types.

The `artist` and `year` filters can be used while searching **albums**, **artists** and **tracks**. You can filter on a **single year** or a **range** (e.g. 1955-1960).  
The `album` filter can be used while searching **albums** and **tracks**.  
The `genre` filter can be used while searching **artists** and **tracks**.  
The `isrc` and `track` filters can be used while searching **tracks**.  
The `upc`, `tag:new` and `tag:hipster` filters can only be used while searching **albums**. The `tag:new` filter will return albums released in the past two weeks and `tag:hipster` can be used to return only albums with the lowest 10% popularity.

## Lyrics search

If you don’t know a song's title, search at least 3 words from its lyrics. 

## Exemples

Find music by genre and year - `genre:metal year:1982`  
Find music between two years - `year:1970-1979`