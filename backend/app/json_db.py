import json
import os
from typing import List, Dict, Any

# Use absolute path to ensure it works regardless of CWD
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data"))

class JsonDB:
    def __init__(self, collection_name: str):
        self.file_path = os.path.join(DATA_DIR, f"{collection_name}.json")
        self._ensure_file()

    def _ensure_file(self):
        if not os.path.exists(DATA_DIR):
            os.makedirs(DATA_DIR)
        if not os.path.exists(self.file_path):
            with open(self.file_path, "w") as f:
                json.dump([], f)

    def _read_data(self) -> List[Dict[str, Any]]:
        with open(self.file_path, "r") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []

    def _write_data(self, data: List[Dict[str, Any]]):
        with open(self.file_path, "w") as f:
            json.dump(data, f, indent=2)

    async def find(self):
        # Return a list directly, but routes expect async iterator?
        # Or I can return an object that is an async iterator.
        data = self._read_data()
        for item in data:
            yield item

    async def find_list(self) -> List[Dict[str, Any]]:
         return self._read_data()

    async def find_one(self, query: Dict[str, Any]) -> Dict[str, Any] | None:
        data = self._read_data()
        for item in data:
            if all(item.get(k) == v for k, v in query.items()):
                return item
        return None

    async def insert_one(self, document: Dict[str, Any]):
        data = self._read_data()
        # If _id is not present, maybe generate one? 
        # But routes seem to handle IDs or not rely on _id for logic except finding back.
        # I'll just append.
        data.append(document)
        self._write_data(data)
        
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        
        # Return something that has inserted_id. 
        # If document has _id, use it. If not, use None (routes might fail if they query by _id).
        # My routes use: created = await collection.find_one({"_id": new.inserted_id})
        # So I MUST have _id.
        import uuid
        if "_id" not in document:
            document["_id"] = str(uuid.uuid4())
            # Re-write with _id
            self._write_data(data)
            
        return InsertResult(document["_id"])

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        data = self._read_data()
        updated = False
        for item in data:
            if all(item.get(k) == v for k, v in query.items()):
                if "$set" in update:
                    for k, v in update["$set"].items():
                        item[k] = v
                updated = True
                break
        if updated:
            self._write_data(data)
            return True
        return None

    async def delete_one(self, query: Dict[str, Any]):
        data = self._read_data()
        new_data = [item for item in data if not all(item.get(k) == v for k, v in query.items())]
        
        class DeleteResult:
            def __init__(self, count):
                self.deleted_count = count
                
        if len(new_data) < len(data):
            self._write_data(new_data)
            return DeleteResult(1)
        return DeleteResult(0)

    async def count_documents(self, query: Dict[str, Any]) -> int:
        data = self._read_data()
        if not query:
            return len(data)
        return len([item for item in data if all(item.get(k) == v for k, v in query.items())])
