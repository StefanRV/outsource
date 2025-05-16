
const generateCRUDControllers = (model) => {
    
    const controllers = {
        create: async (req, res) => {
            try {

                
       
                const data = { ...req.body};
        
   
                const createdItem = await model.create(data);
        
                res.status(201).json(createdItem);
            } catch (error) {
     
                res.status(400).json(error);
            }
        },
        
        findAll: async (req, res) => {
            try {
                const items = await model.findAll();
                res.status(200).json(items);
            } catch (error) {
                res.status(500).json(error);
            }
        },
        findOne: async (req, res) => {
            try {
                const item = await model.findByPk(req.params.id);
                if (!item) return res.status(404).json({ message: 'Item not found' });
                res.json(item);
            } catch (error) {
                res.status(500).json(error);
            }
        },
        update: async (req, res) => {
            try {

            const data = { ...req.body};
            console.log('data'+data);
                await model.update(data, { where: { id: req.params.id} });
                const updatedResource = await model.findByPk(req.params.id);
                res.json(updatedResource);
            } catch (error) {
                res.status(500).json({ error: 'Внутренняя ошибка сервера' });
            }
        },
        delete: async (req, res) => {
            try {

                
           
                await model.destroy({ where: { id: req.params.id } });
                res.status(204).json({ message: 'Resource deleted' });
            } catch (error) {
                console.error('Ошибка при удалении ресурса:', error.message);
                res.status(500).json({ error: 'Внутренняя ошибка сервера' });
            }
        }
    };
        
 return controllers;
}
module.exports = generateCRUDControllers;